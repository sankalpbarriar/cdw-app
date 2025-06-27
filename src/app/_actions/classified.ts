"use server";

import { auth } from "@/auth";
import { StreamableSkeletonProps } from "@/components/admin/classified/streambale-skeloton";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { generateThumHashFromSrcUrl } from "@/lib/thumhash-sever";
import { CurrencyCode } from "@prisma/client";
import { randomInt } from "crypto";
import { revalidatePath } from "next/cache";
import { forbidden, redirect } from "next/navigation";
import slugify from "slugify";
import { createPngDataUri } from "unlazy/thumbhash";
import { UpdateClassifedType } from "../schemas/classified.schema";

export const createClassifiedAction = async (data: StreamableSkeletonProps) => {
  const session = await auth();
  if (!session) {
    console.error("⛔ Unauthorized access");
    return { success: false, message: "Unauthorized" };
  }

  // 🧪 Validate critical input
  if (!data.makeId || !data.modelId) {
    console.error("❌ Missing required fields", {
      makeId: data.makeId,
      modelId: data.modelId,
    });
    return { success: false, message: "Make and Model are required" };
  }

  let success = false;
  let classifiedId: number | null = null;

  try {
    console.log("🔍 Fetching make with ID:", data.makeId);
    const make = await prisma.make.findUnique({
      where: { id: data.makeId },
    });

    console.log("🔍 Fetching model with ID:", data.modelId);
    const model = await prisma.model.findUnique({
      where: { id: data.modelId },
    });

    if (!make || !model) {
      console.error("❌ Invalid make or model", { make, model });
      return { success: false, message: "Make or Model not found" };
    }

    let title = `${data.year} ${make.name} ${model.name}`;

    if (data?.modelVariantId) {
      console.log("🔍 Fetching modelVariant with ID:", data.modelVariantId);
      const modelVariant = await prisma.modelVariant.findUnique({
        where: { id: data.modelVariantId },
      });

      if (modelVariant) title += ` ${modelVariant.name}`;
    }

    let slug = slugify(`${title} ${data.vrm ?? randomInt(100000, 999999)}`);
    console.log("📝 Generated slug:", slug);

    const slugLikeFound = await prisma.classified.count({
      where: { slug: { contains: slug, mode: "insensitive" } },
    });

    if (slugLikeFound) {
      slug = slugify(`${title} ${data.vrm} ${slugLikeFound + 1}`);
      console.log("⚠️ Slug conflict found. Updated slug:", slug);
    }

    console.log("🎨 Generating thumbhash from:", data.image);
    const thumbhash = await generateThumHashFromSrcUrl(data.image as string);
    const uri = createPngDataUri(thumbhash);

    console.log("💾 Creating classified...");
    const classified = await prisma.classified.create({
      data: {
        slug,
        title,
        year: Number(data.year),
        makeId: data.makeId,
        modelId: data.modelId,
        ...(data.modelVariantId && {
          modelVariantId: data.modelVariantId,
        }),
        vrm: data?.vrm ?? null,
        price: 0,
        currency: CurrencyCode.INR,
        odoReading: data.odoReading,
        odoUnit: data.odoUnit,
        fuelType: data.fuelType,
        bodyType: data.bodyType,
        colour: data.colour,
        transmission: data.transmission,
        ulezCompliance: data.ulezCompliance,
        description: data.description,
        doors: data.doors,
        seats: data.seats,
        images: {
          create: {
            isMain: true,
            blurhash: uri,
            src: data.image as string,
            alt: title,
          },
        },
      },
    });

    if (classified) {
      console.log("✅ Classified created with ID:", classified.id);
      classifiedId = classified.id;
      success = true;
    }
  } catch (error) {
    console.error("❌ Error creating classified:", error);
    return { success: false, message: "Something went wrong" };
  }

  if (success && classifiedId) {
    console.log("♻️ Revalidating path:", routes.admin.classifieds);
    revalidatePath(routes.admin.classifieds);
    console.log(
      "🚀 Redirecting to edit page:",
      routes.admin.editClassified(classifiedId)
    );
    redirect(routes.admin.editClassified(classifiedId));
  } else {
    return { success: false, message: "Failed to create classified" };
  }
};

export const updateClassifiedAction = async (data: UpdateClassifedType) => {
  const session = await auth();
  if (!session) forbidden();

  let success = false;

  try {
    const makeId = Number(data.make);
    const modelId = Number(data.model);
    const modelVariantId = data.modelVariant ? Number(data.modelVariant) : null;

    const make = await prisma.make.findUnique({ where: { id: makeId } });
    const model = await prisma.model.findUnique({ where: { id: modelId } });

    let title = `${data.year} ${make?.name} ${model?.name}`;

    if (modelVariantId) {
      const modelVariant = await prisma.modelVariant.findUnique({
        where: { id: modelVariantId },
      });

      if (modelVariant) title += ` ${modelVariant.name}`;
    }

    const slug = slugify(`${title} ${data.vrm ?? ""}`);

    // 🧪 Preprocess image data OUTSIDE transaction
    // console.log("🎨 Preprocessing image thumbhashes...");
    const imagesData = await Promise.all(
      data.images.map(async ({ src }, index) => {
        const hash = await generateThumHashFromSrcUrl(src);
        const uri = createPngDataUri(hash);
        return {
          classifiedId: data.id,
          isMain: index === 0,
          blurhash: uri,
          src,
          alt: `${title} ${index + 1}`,
        };
      })
    );

    // console.log("🔁 Running Prisma transaction...");
    const [classified, images] = await prisma.$transaction(
      async (tx) => {
        await tx.image.deleteMany({
          where: { classifiedId: data.id },
        });

        const createdImages = await tx.image.createManyAndReturn({
          data: imagesData,
        });

        const updatedClassified = await tx.classified.update({
          where: { id: data.id },
          data: {
            slug,
            title,
            year: Number(data.year),
            makeId,
            modelId,
            ...(modelVariantId && { modelVariantId }),
            vrm: data.vrm,
            price: data.price * 100,
            currency: data.currency,
            odoReading: data.odoReading,
            odoUnit: data.odoUnit,
            fuelType: data.fuelType,
            bodyType: data.bodyType,
            transmission: data.transmission,
            colour: data.colour,
            ulezCompliance: data.ulezCompliance,
            description: data.description,
            doors: data.doors,
            seats: data.seats,
            images: {
              set: createdImages.map((image) => ({ id: image.id })),
            },
          },
        });

        return [updatedClassified, createdImages];
      },
      { timeout: 10000 }
    );

    if (classified && images) {
      success = true;
      // console.log("✅ Classified and images updated successfully.");
    }
  } catch (error) {
    // console.error("❌ Error in updateClassifiedAction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }

  if (success) {
    console.log("♻️ Revalidating path:", routes.admin.classifieds);
    revalidatePath(routes.admin.classifieds);
    console.log("🚀 Redirecting to classifieds list");
    redirect(routes.admin.classifieds);
  } else {
    return { success: false, message: "Failed to update classifieds" };
  }
};

