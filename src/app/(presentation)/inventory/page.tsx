import { ClassifiedList } from "@/components/inventory/classified-list";
import { Sidebar } from "@/components/inventory/sidebar";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { CLASSIFIED_PER_PAGE } from "@/config/constants";
import { routes } from "@/config/routes";
import { AwaitedPageProps, Favourites, PageProps } from "@/config/types"
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis-store";
import { getSouceId } from "@/lib/source-id";
import { ClassifiedStatus, Prisma } from "@prisma/client";
import { z } from "zod";


const pageSchema = z
    .string()
    .transform((val) => Math.max(Number(val), 1))
    .optional()


const ClassifiedFilterSchema = z.object({
    q: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    modelVariant: z.string().optional(),
    minYear: z.string().optional(),
    maxYear: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    minReading: z.string().optional(),
    maxReading: z.string().optional(),
    currency: z.string().optional(),
    transmission: z.string().optional(),
    fuelType: z.string().optional(),
    bodyType: z.string().optional(),
    colour: z.string().optional(),
    doors: z.string().optional(),
    seats: z.string().optional(),
    compliance: z.string().optional(),
});
const buildClassifiedFilterQuery = (searchParams: AwaitedPageProps['searchParams'] | undefined,)
    : Prisma.ClassifiedWhereInput => {
    const { data } = ClassifiedFilterSchema.safeParse(searchParams);
    if (!data) return { status: ClassifiedStatus.LIVE };

    const keys = Object.keys(data);

    const taxonomyFilters = ["make", "model", "modelVarinat"];

    const rangeFilter = {
        minYear: "year",
        maxYear: "year",
        minPrice: "price",
        maxPrice: "price",
        minReading: "odoReading",
        maxReading: "odoReading",
    }

    const mapParamsToField = keys.reduce((acc, key) => {
        const value = searchParams?.[key] as string | undefined;
        if (!value) return acc;

        if (taxonomyFilters.includes(key)) {
            acc[key] = { id: Number(value) }
        }
        else if (key in rangeFilter) {
            const field = rangeFilter[key as keyof typeof rangeFilter];
            acc[field] = acc[field] || {};
            if (key.startsWith("min")) {
                acc[field].gte = Number(value);
            }
            else {
                if (key.startsWith("max")) {
                    acc[field].lte = Number(value);
                }
            }
        }

        return acc;
    }, {} as { [key: string]: any }
    );

    console.log({ mapParamsToField })

    return {
        status: ClassifiedStatus.LIVE,

        ...(searchParams?.q && {
            OR: [
                {
                    title: {
                        contains: searchParams.q as string,
                        mode: "insensitive",
                    }
                },
                {
                    description: {
                        contains: searchParams.q as string,
                        mode: "insensitive",
                    }
                }
            ]
        }),

        ...mapParamsToField,
    }
}

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
        where: buildClassifiedFilterQuery(serachParams),
        include: { images: { take: 1 } },
        skip: offset,
        take: CLASSIFIED_PER_PAGE,
    });
}
export default async function InventoryPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const classifieds = await getInventory(searchParams);
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