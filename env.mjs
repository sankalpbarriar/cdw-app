import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    S3_BUCKET_ACCESS_KEY: z.string(),
    S3_BUCKET_SECRET_KEY: z.string(),
    RESEND_API_KEY: z.string(),
    NEXTAUTH_SECRET: z.string(),
    FROM_EMAIL_ADDRESS:z.string(),
    X_AUTH_TOKEN:z.string(),
    GOOGLE_GENERATIVE_AI_API_KEY:z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_IMGIX_URL: z.string().url(),
    NEXT_PUBLIC_S3_BUCKET_REGION: z.string(),
    NEXT_PUBLIC_S3_BUCKET_NAME: z.string(),
    NEXT_PUBLIC_S3_URL: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_IMGIX_URL: process.env.NEXT_PUBLIC_IMGIX_URL,
    S3_BUCKET_ACCESS_KEY: process.env.S3_BUCKET_ACCESS_KEY,
    S3_BUCKET_SECRET_KEY: process.env.S3_BUCKET_SECRET_KEY,
    NEXT_PUBLIC_S3_BUCKET_REGION:process.env.NEXT_PUBLIC_S3_BUCKET_REGION,
    NEXT_PUBLIC_S3_BUCKET_NAME:process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    NEXT_PUBLIC_S3_URL:process.env.NEXT_PUBLIC_S3_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    FROM_EMAIL_ADDRESS: process.env.FROM_EMAIL_ADDRESS,
    X_AUTH_TOKEN : process.env.X_AUTH_TOKEN,
    GOOGLE_GENERATIVE_AI_API_KEY:process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  },
});
