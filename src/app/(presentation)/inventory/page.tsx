import { pageSchema } from "@/app/schemas/page.schema";
import { ClassifiedList } from "@/components/inventory/classified-list";
import { DialogFilters } from "@/components/inventory/dialog-filters";
import { IneventorySkeleton } from "@/components/inventory/inventory-skeleton";
import { Sidebar } from "@/components/inventory/sidebar";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { CLASSIFIED_PER_PAGE } from "@/config/constants";
import { routes } from "@/config/routes";
import { AwaitedPageProps, Favourites, PageProps } from "@/config/types"
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis-store";
import { getSouceId } from "@/lib/source-id";
import { buildClassifiedFilterQuery } from "@/lib/utils";
import { ClassifiedStatus } from "@prisma/client";
import { Suspense } from "react";

const getInventory = async (serachParams: AwaitedPageProps['searchParams']) => {
    const validPage = pageSchema.parse(serachParams?.page);

    //get the current page
    const page = validPage ? validPage : 1;

    //calculate the offset
    const offset = (page - 1) * CLASSIFIED_PER_PAGE
    return prisma.classified.findMany({
        where: buildClassifiedFilterQuery(serachParams),
        include: { images: { take: 1 } },
        skip: offset,
        take: CLASSIFIED_PER_PAGE,
    });
}
export default async function InventoryPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const classifieds = getInventory(searchParams);
    const count = await prisma.classified.count({
        where: buildClassifiedFilterQuery(searchParams),
    });
    // console.log(count);

    const minMaxResult = await prisma.classified.aggregate({
        where: { status: ClassifiedStatus.LIVE },
        _min: {
            year: true,
            price: true,
            odoReading: true,
        },
        _max: {
            price: true,
            year: true,
            odoReading: true
        },
    })

    const sourceId = await getSouceId();
    const favourites = await redis.get<Favourites>(sourceId ?? " ");
    const totalPages = Math.ceil(count / CLASSIFIED_PER_PAGE);

    console.log({ favourites })
    return (
        <div className="flex">
            {/* <SideBar/> */}
            <Sidebar minMaxValues={minMaxResult} searchParams={searchParams} />
            <div className="flex-1 p-4 bg-white">
                <div className="flex space-y-2 flex-col items-center justify-center pb-4 -mt-1">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-sm mg:text-base lg:text-xl text-gray-600 font-semibold min-w-fit">
                            We have found {count} clasifieds
                        </h2>
                        <DialogFilters minMaxValues={minMaxResult} count={count} searchParams={searchParams} />
                    </div>
                    <CustomPagination
                        baseURL={routes.inventory}
                        totalPages={totalPages}
                        styles={{
                            paginationRoot: "justify-end hidden lg:flex",
                            paginationPrevious: "",
                            paginationNext: "",
                            paginationLinkActive: "",
                            paginationLink: "border-none active:border tex-black"
                        }}
                    />
                </div>
                <Suspense fallback={<IneventorySkeleton/>}>
                    <ClassifiedList
                        classifieds={classifieds}
                        favourites={favourites ? favourites.ids : []}
                    />
                </Suspense>
                <CustomPagination
                    baseURL={routes.inventory}
                    totalPages={totalPages}
                    styles={{
                        paginationRoot: "justify-center lg:hidden pt-12",
                        paginationPrevious: "",
                        paginationNext: "",
                        paginationLinkActive: "",
                        paginationLink: "border-none active:border"
                    }}
                />
            </div>
        </div>
    )
}