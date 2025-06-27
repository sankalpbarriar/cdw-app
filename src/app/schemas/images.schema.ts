import { z } from "zod";
import { zfd } from "zod-form-data";

export const SingleImageSchema = z.object({
  image: z.string().url(),
});

export type SingleImageSchemaType = z.infer<typeof SingleImageSchema>;

export const SingleImageUploadSchema = zfd.formData({
  file: zfd.file(),
});

export const InitaliseMultiparUploadSchema = z.object({
  name: z.string(),
  uuid: z.string(),
});
export const GetMultiparUploadSchema = z.object({
  fileKey: z.string(),
  fileId: z.string(),
  parts: z.number(),
});
export const FinalizeMultipartUploadSchema = z.object({
  fileId: z.string(),
  fileKey: z.string(),
  parts: z.array(
    z.object({
      PartNumber: z.number(),
      ETag: z.string(),
    })
  ),
});
