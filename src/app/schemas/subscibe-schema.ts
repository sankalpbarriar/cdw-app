import { z } from "zod";

export const SubscribeSchema = z.object({
  firstName: z.string().min(1, { message: "first name is required" }),
  lastName: z.string().min(1, { message: "last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});