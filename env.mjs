import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    S3_BUCKET_ACCESS_KEY:z.string(),
    S3_BUCKET_SECRET_KEY:z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_IMGIX_URL:z.string().url()
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_IMGIX_URL : process.env.NEXT_PUBLIC_IMGIX_URL,
    S3_BUCKET_ACCESS_KEY:process.env.S3_BUCKET_ACCESS_KEY,
    S3_BUCKET_SECRET_KEY:process.env.S3_BUCKET_SECRET_KEY,
  },
});
