import { MultiStepFormEnum } from "@/config/types";
import { z } from "zod";

export const MultiStepFormSchema = z.object({
  step: z.nativeEnum(MultiStepFormEnum),
  slug: z.string(),
});

export const SelectDateSchema = z.object({
    handoverDate: z.string({ message: "Handover date is required" }),
    handoverTime: z.string({ message: "Handover time is required" }),
})

export type SelectDateType = z.infer<typeof SelectDateSchema>;
