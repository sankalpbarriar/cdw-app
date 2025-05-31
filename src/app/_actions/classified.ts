'use server';

import { auth } from "@/auth";
import { StreamableSkeletonProps } from "@/components/admin/classified/streambale-skeloton";
import { routes } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import { generateThumHashFromSrcUrl } from "@/lib/thumhash-sever";
import { CurrencyCode } from "@prisma/client";
import { randomInt } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { createPngDataUri } from "unlazy/thumbhash";

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
    console.log("🚀 Redirecting to edit page:", routes.admin.editClassified(classifiedId));
    redirect(routes.admin.editClassified(classifiedId));
  } else {
    return { success: false, message: "Failed to create classified" };
  }
};
