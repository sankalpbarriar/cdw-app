import { NextAuthConfig, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialProvider from "@auth/core/providers/credentials";
import ResendProvider from "@auth/core/providers/resend";
import { prisma } from "@/lib/prisma";
import { bcryptPasswordCompare } from "@/lib/bcrypt";
import { SESSION_MAX_AGE } from "@/config/constants";
import { routes } from "@/config/routes";
import { SignInSchema } from "@/app/schemas/auth.schema";

export const config = {
  adapter: PrismaAdapter(prisma),
  useSecureCookies: false,
  trustHost: true,
  session: {
    strategy: "database",
    maxAge: SESSION_MAX_AGE / 1000,
  },

  providers: [
    CredentialProvider({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials): Promise<User | null> => {
        try {
          const validatedField = SignInSchema.safeParse(credentials);
          if (!validatedField.success) return null;

          const user = await prisma.user.findUnique({
            where: { email: validatedField.data.email },
            select: { id: true, hashedPassword: true },
          });

          if (!user) return null;

          const match = await bcryptPasswordCompare(
            validatedField.data.password,
            user.hashedPassword
          );

          console.log({
            hashedPassword:user.hashedPassword,
            password:validatedField.data.password
          })
          if (!match) return null;

          //issue a challenge
          return { ...user, requires2FA: true };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
    ResendProvider({}),
  ],
  pages: {
    //overriding the default seetings that the next auth provides
    signIn: routes.signIn,
    signOut: "/auth/sign-out",
    error: "/auth/error",
  },
  callbacks: {
    //we are not actually using jwt the purpose is a bit of hack to create a session
    async jwt({ user, token }) {
      const session = await prisma.session.create({
        data: {
          expires: new Date(Date.now() + SESSION_MAX_AGE),
          sessionToken: crypto.randomUUID(),
          userId: user.id as string,
          requires2FA: user.requires2FA,
        },
      });
      if (!session) return null;

      //we just copying the token in jwt goona expires the same time session expires whihc will trigger the seesion to be deleted from the database
      if (user) token.requires2FA = user.requires2FA;
      token.id = session.sessionToken;
      token.exp = session.expires.getTime();
      return token;
    },

    async session({ session, user }) {
      const newSession = {
        user,
        requires2FA: true,
        expires: session.expires,
      };
      return newSession;
    },
  },
  jwt: {
    encode: async ({ token }) => token?.id as string,
  },
} as NextAuthConfig;
