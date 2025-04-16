import { imageSource } from "@/config/constants";
import { faker } from "@faker-js/faker";
import { PrismaClient, Prisma } from "@prisma/client";
import { createPngDataUri } from "unlazy/thumbhash";

export async function seedImages(prisma: PrismaClient) {
  const classifieds = await prisma.classified.findMany();

  const classifiedIds = classifieds.map((classified) => classified.id);

  //loop over classified id's

  for (const classifiedId of classifiedIds) {
    const image: Prisma.ImageCreateInput = {
      src: imageSource.classifiedPlaceholder,
      alt: faker.lorem.words(2),
      classified: { connect: { id: classifiedId } },
      blurhash: createPngDataUri("jPcJDYCndnZwl4h6Z2eYhWZ/c/VI"),
    };
    await prisma.image.create({
      data: image,
    });
  }
}
