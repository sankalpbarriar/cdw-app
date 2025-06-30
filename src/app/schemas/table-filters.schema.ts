//schema for filter at the top

import { ClassifiedStatus, CustomerStatus } from "@prisma/client";
import { z } from "zod";

export const AdminClassifiedFilterSchema = z.object({
    q:z.string().optional(),
    status:z.enum(["ALL",...Object.values(ClassifiedStatus)]).optional().default("ALL"),
})
export const AdminCustomerFilterSchema = z.object({
    q:z.string().optional(),
    status:z.enum(["ALL",...Object.values(CustomerStatus)]).optional().default("ALL"),
})