import { MultiStepFormEnum } from "./types";

export const routes = {
  home: "/",
  singleClassified: (slug: string) => `/inventory/${slug}`,
  reserve:(slug:string,step:MultiStepFormEnum) =>`/inventory/${slug}/reserve?step=${step}`,
  favourites:'/favourites',
};
