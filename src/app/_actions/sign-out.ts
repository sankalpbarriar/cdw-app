
'use server'
import { auth, signOut } from "@/auth";
import { routes } from "@/config/routes";

export const signOutAction = async () => {
  const session = await auth();
  if (session)
    await signOut({
      redirect: true,
      redirectTo: routes.signIn,
    });
};
