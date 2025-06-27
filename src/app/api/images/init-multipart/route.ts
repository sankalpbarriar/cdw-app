import { InitaliseMultiparUploadSchema } from "@/app/schemas/images.schema";
import { auth } from "@/auth";
import { env } from "@/env";
import { s3 } from "@/lib/S3";
import type { CreateMultipartUploadCommandInput } from "@aws-sdk/client-s3";
import { forbidden } from "next/navigation";
import { NextResponse } from "next/server";

export const POST = auth(async (req) => {
	try {
		if (!req.auth) forbidden();
		const data = await req.json();
		const validated = InitaliseMultiparUploadSchema.safeParse(data);
		if (!validated.success) return NextResponse.error();
		const { name, uuid } = validated.data;
		const key = `uploads/${uuid}/${name}`;
		const { default: mimetype } = await import("mime-types");

		const mime = mimetype.lookup(name);

		const multipartParams: CreateMultipartUploadCommandInput = {
			Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
			Key: key.replace(/\s+/g, "-"),
			...(mime && { ContentType: mime }),
		};

		const { CreateMultipartUploadCommand } = await import("@aws-sdk/client-s3");

		const command = new CreateMultipartUploadCommand(multipartParams);

		const multipartUpload = await s3.send(command);

		return NextResponse.json(
			{
				fileId: multipartUpload.UploadId,
				fileKey: multipartUpload.Key,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log(`Error in initialising multipart upload: ${error}`);
		return NextResponse.error();
	}
});