import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    requires2FA: boolean;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      requires2FA: boolean;
    };
  }
}
