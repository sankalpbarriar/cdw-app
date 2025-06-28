//this is gonaa allow us to validate out pagination

import { z } from "zod";

export const PaginationSchema = z.object({
  page: z
    .string()
    .refine((val) => Number(val) > 0, {
      message: "Page must be greater than 0",
    })
    .default("1"),
  itemsPerPage: z
    .enum(["10", "25", "50", "100"])
    .refine((val) => Number(val) > 0, {
      message: "Items per page must be greater than 0",
    })
    .default("10"),
});

export type PaginationType = z.infer<typeof PaginationSchema>;

export const validatePagination = ({
  page,
  itemsPerPage,
}: PaginationType) => {
  const { data, success, error } = PaginationSchema.safeParse({
    page,
    itemsPerPage,
  });

  if (error) console.log("Vaidation error:", error);

  if (!success) {
    return {
      page: "1",
      itemsPerPage: "10",
    };
  }

  return data;
};
