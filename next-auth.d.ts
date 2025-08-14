import type NextAuth from "next-auth";

declare module "next-auth" {
	interface User extends NextAuth.User {
		requires2FA?: boolean | undefined;
	}

	interface Session extends NextAuth.Session {
		requires2FA?: boolean;
	}
}