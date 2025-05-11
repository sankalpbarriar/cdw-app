import type NextAuth from "next-auth";

declare module "next-auth" {
  interface User extends NextAuth.user {
    requires2FA: boolean;
  }
  interface Session extends NextAuthResult.Session {
    requires2FA: true;
  }
}
