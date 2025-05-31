import { ModelVariant } from "@prisma/client";
import { prisma } from "./prisma";

interface MapToTaxonomyOrCreateType {
  year: number;
  make: string;
  model: string;
  modelVarinat: string | null;
}

export async function mapToTaxonomyOrCreate(object: MapToTaxonomyOrCreateType) {
  //attemt to find the make
  const make = await prisma.make.findFirst({
    where: { name: { equals: object.make, mode: "insensitive" } },
  });

  if (!make) throw new Error(`Make "${object.make}" not found`);

  let model = await prisma.model.findFirst({
    where: {
      makeId: make.id,
      name: { contains: object.model, mode: "insensitive" },
    },
  });

  if (!model) {
    model = await prisma.$transaction(async (prisma) => {
      await prisma.$executeRaw`LOCK TABLE "models" IN EXCLUSIVE MODE`;
      return prisma.model.create({
        data: {
          name: object.model,
          make: { connect: { id: make.id } },
        },
      });
    });
  }

  if (!model) throw new Error("Model not found");

  let modelVariant: ModelVariant | null = null;

  if (object.modelVarinat) {
    modelVariant = await prisma.modelVariant.findFirst({
      where: {
        modelId: model.id,
        name: { contains: object.modelVarinat, mode: "insensitive" },
      },
    });

    if (!modelVariant) {
      modelVariant = await prisma.$transaction(async (prisma) => {
        await prisma.$executeRaw`LOCK TABLE "model_variants" IN EXCLUSIVE MODE`;
        return prisma.modelVariant.create({
          data: {
            name: object.modelVarinat as string,
            model: { connect: { id: model.id } },
            yearStart: object.year,
            yearEnd: object.year,
          },
        });
      });
    }
  }

  return {
    year: object.year,
    make: make.name,
    model: model.name,
    modelVarinat: modelVariant?.name || null,
    makeId: make.id,
    modelId: model.id,
    modelVariantId: modelVariant?.id || null,
  };
}
