import { ClassifiedList } from "@/components/inventory/classified-list";
import { Sidebar } from "@/components/inventory/sidebar";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { CLASSIFIED_PER_PAGE } from "@/config/constants";
import { routes } from "@/config/routes";
import { AwaitedPageProps, Favourites, PageProps } from "@/config/types"
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis-store";
import { getSouceId } from "@/lib/source-id";
import { z } from "zod";


const pageSchema = z
    .string()
    .transform((val) => Math.max(Number(val), 1))
    .optional()

const getInventory = async (serachParams: AwaitedPageProps['searchParams']) => {
    const validPage = z
        .string()
        .transform((val) => Math.max(Number(val), 1))
        .optional()
        .parse(serachParams?.page);

    //get the current page
    const page = validPage ? validPage : 1;

    //calculate the offset
    const offset = (page - 1) * CLASSIFIED_PER_PAGE
    return prisma.classified.findMany({
        include: { images: { take: 1 } },
        skip: offset,
        take: CLASSIFIED_PER_PAGE,
    });
}
export default async function InventoryPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const classifieds = await getInventory(searchParams);
    const count = await prisma.classified.count();
    // console.log(count);

    const sourceId = await getSouceId();
    const favourites = await redis.get<Favourites>(sourceId ?? " ");
    const totalPages = Math.ceil(count / CLASSIFIED_PER_PAGE);

    console.log({ favourites })
    return (
        <div className="flex">
            {/* <SideBar/> */}
            <Sidebar minMaxValues={null} searchParams={searchParams} />
            <div className="flex-1 p-4 bg-white">
                <div className="flex space-y-2 flex-col items-center justify-center pb-4 -mt-1">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-sm mg:text-base lg:text-xl text-gray-600 font-semibold min-w-fit">
                            We have found {count} clasifieds
                        </h2>
                        {/* <DialogFilters/> */}
                    </div>
                    <CustomPagination
                        baseURL={routes.inventory}
                        totalPages={totalPages}
                        styles={{
                            paginationRoot: "xl:flex justify-end",
                            paginationPrevious: "",
                            paginationNext: "",
                            paginationLinkActive: "",
                            paginationLink: "border-none active:border"
                        }}
                    />
                    <ClassifiedList classifieds={classifieds} favourites={favourites ? favourites.ids : []} />
                </div>
            </div>
        </div>
    )
}