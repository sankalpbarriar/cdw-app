import NextAuth from "next-auth";
import {config} from "./auth.config";

export const {
  handlers: { GET, POST },
  auth, //used through the app to get the session
  signIn,
  signOut,
} = NextAuth(config);
