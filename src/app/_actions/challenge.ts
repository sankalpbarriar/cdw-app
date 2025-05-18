"use server";

import { auth } from "@/auth";
import { completeChallenge, issueChallenge } from "@/lib/opt";
import { genericRateLimit } from "@/lib/rate-limiter";

export const resendChallengeAction = async () => {
  const limmiterError = await genericRateLimit("otp");
      if(limmiterError) return limmiterError;
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: "Un authorized",
    };
  }
  await issueChallenge(session.user.id as string, session.user.email as string);

  return {
    success: true,
    message: "Code send successfully",
  };
};

export const completeChallengeAction = async (code:string) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: "Un authorized",
    };
  }

  const { id } = session.user;
  const result = await completeChallenge(id as string, code);
  return result;
};
