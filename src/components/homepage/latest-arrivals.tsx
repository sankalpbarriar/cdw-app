'use clientS'
import { prisma } from "@/lib/prisma"
import { LatestArraivalsCarousel } from "./latest-arrivals-carousel"
import { ClassifiedStatus } from "@prisma/client"
import { getSouceId } from "@/lib/source-id";
import { redis } from "@/lib/redis-store";
import { Favourites } from "@/config/types";

export const LatestArraivals = async () => {
    const classifieds = await prisma.classified.findMany({
        where: {
            status: ClassifiedStatus.LIVE
        },
        take: 6,
        include: { images: true }
    });

    const sourceId = await getSouceId();
    const favourites = await redis.get<Favourites>(sourceId || "")
    return (
        <section className="py-16 sm:py-24">
            <div className="container mx-auto max-w-[80vw]">
                <h2 className="mt-2 uppercase text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Latest Arrivals
                </h2>
                <LatestArraivalsCarousel
                    classifieds={classifieds}
                    favourites={favourites ? favourites.ids : []}
                />
            </div>
        </section>
    );
};