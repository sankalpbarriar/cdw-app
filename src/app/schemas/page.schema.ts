import { z } from "zod";

export const pageSchema = z
  .string()
  .transform((val) => Math.max(Number(val), 1))
  .optional();
