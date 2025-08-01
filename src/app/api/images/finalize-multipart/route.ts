import { FinalizeMultipartUploadSchema } from "@/app/schemas/images.schema";
import { auth } from "@/auth";
import { env } from "@/env";
import { s3 } from "@/lib/S3";
import type { CompleteMultipartUploadCommandInput } from "@aws-sdk/client-s3";
import { forbidden } from "next/navigation";
import { NextResponse } from "next/server";

export const POST = auth(async (req) => {
  try {
    if (!req.auth) {
      // console.error("❌ Forbidden: User not authenticated.");
      forbidden();
    }

    const data = await req.json();
    console.log("📦 Incoming finalize-multipart data:", JSON.stringify(data, null, 2));

    const validated = FinalizeMultipartUploadSchema.safeParse(data);

    if (!validated.success) {
      console.error("❌ Validation failed:", validated.error.flatten());
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { fileId, fileKey, parts } = validated.data;

    const { default: mimetype } = await import("mime-types");
    const mime = mimetype.lookup(fileKey);

    const { default: orderBy } = await import("lodash.orderby");

    const multipartParams: CompleteMultipartUploadCommandInput = {
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: fileKey,
      UploadId: fileId,
      MultipartUpload: {
        Parts: orderBy(parts, ["PartNumber"], ["asc"]),
      },
      ...(mime && { ContentType: mime }),
    };

    console.log("🚀 Sending CompleteMultipartUploadCommand with params:", multipartParams);

    const { CompleteMultipartUploadCommand } = await import("@aws-sdk/client-s3");
    const command = new CompleteMultipartUploadCommand(multipartParams);
    const payload = await s3.send(command);

    console.log("✅ Multipart upload completed. AWS Response:", payload);

    return NextResponse.json(
      {
        url: payload.Location,
        key: payload.Key,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error in finalizing multipart upload:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(err) },
      { status: 500 }
    );
  }
});
