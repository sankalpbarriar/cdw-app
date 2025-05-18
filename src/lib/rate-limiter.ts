import { PrevState } from "@/config/types";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { differenceInMinutes } from "date-fns";
import { headers } from "next/headers";

const ratelimitLogin = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"), //5 request per 10 minites
});

const ratelimitOtp = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"), //3 request per 1 minites
});

async function genericRateLimiter(type: "otp" | "login") {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "";
  return type == "otp" ? ratelimitOtp.limit(ip) : ratelimitLogin.limit(ip);
}

export async function genericRateLimit(
  type: "otp" | "login"
): Promise<PrevState | undefined> {
  const { success, reset } = await genericRateLimiter(type);
  const resetTime = new Date(reset);
  const now = new Date();
  const differenceInSeconds = Math.round(
    (resetTime.getTime() - now.getTime()) / 1000
  );

  if (!success) {
    if (differenceInSeconds > 60) {
      const resetTimeInMinutes = differenceInMinutes(resetTime, now);
      return {
        success: false,
        message: `Too many attempts : Please try again in ${resetTimeInMinutes} minute${resetTimeInMinutes > 1 ? "s" : ""}`,
      };
    }

    return {
      success: false,
      message: `Too many attempts : Please try again in ${differenceInSeconds} second${differenceInSeconds > 1 ? "s" : ""}`,
    };
  }
}
