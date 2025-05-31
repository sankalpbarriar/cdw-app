import { z } from "zod";
import { zfd } from "zod-form-data";

export const SingleImageSchema = z.object({
  image: z.string().url(),
});

export type SingleImageSchemaType = z.infer<typeof SingleImageSchema>;

export const SingleImageUploadSchema = zfd.formData({
  file: zfd.file(),
});
