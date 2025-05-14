import { MultiStepFormEnum } from "./types";

export const routes = {
  home: "/",
  singleClassified: (slug: string) => `/inventory/${slug}`,
  reserve: (slug: string, step: MultiStepFormEnum) =>
    `/inventory/${slug}/reserve?step=${step}`,
  favourites: "/favourites",
  inventory: "/inventory",
  notAvailable: (slug: string) => `/inventory/${slug}/not-available`,
  success: (slug: string) => `/inventory/${slug}/success`,
  signIn: "/auth/sign-in",
  challenge: "/auth/challenge",
  admin: {
    dashboard: "/admin/dashboard",
  },
};
