import { ClassifiedList } from "@/components/inventory/classified-list";
import { AwaitedPageProps, Favourites, PageProps } from "@/config/types"
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis-store";
import { getSouceId } from "@/lib/source-id";

const getInventory = async (serachParams: AwaitedPageProps['searchParams']) => {
    return prisma.classified.findMany({
        include: { images: true },
    });
}
export default async function InventoryPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const classifieds = await getInventory(searchParams);
    // const count = await prisma.classified.count();
    // console.log(count);

    const sourceId = await getSouceId();
    const favourites = await redis.get<Favourites>(sourceId ?? " ")
    console.log({favourites})
    return (
        <>
          <ClassifiedList classifieds={classifieds} favourites = {favourites ? favourites.ids:[]}/>
        </>
    )
}