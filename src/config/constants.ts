import { BadgeProps } from "@/components/ui/badge";
import { routes } from "./routes";
import { ClassifiedStatus } from "@prisma/client";

export const imageSource = {
  classifiedPlaceholder:
    "https://velocity-motors.s3.eu-north-1.amazonaws.com/uploads/AdobeStock_855683950.jpeg",

  carLinup:
    "https://velocity-motors.s3.eu-north-1.amazonaws.com/uploads/home.jpeg",
  featureSection:
    "https://velocity-motors.s3.eu-north-1.amazonaws.com/uploads/home.jpeg",
};

export const CLASSIFIED_PER_PAGE = 3;

export const navLinks = [
  { id: 1, href: routes.home, label: "Home" },
  { id: 2, href: routes.inventory, label: "Inventory" },
];

export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; //7 days in seconds -> seesion validity
export const MAX_IMAGE_SIZE = 20 * 1000 * 1000; //2mb
export const MAX_IMAGES = 10;
export const sortOrder = ["asc", "desc"] as const;
export const ClassifiedBadgeMap: Record<
  ClassifiedStatus,
  BadgeProps["variant"]
> = {
  [ClassifiedStatus.DRAFT]: "secondary",
  [ClassifiedStatus.LIVE]: "default",
  [ClassifiedStatus.SOLD]: "destructive",
};
