import { ClassifiedCard } from "@/components/inventory/classified-card";
import { ClassifiedList } from "@/components/inventory/classified-list";
import { AwaitedPageProps, PageProps } from "@/config/types"
import { prisma } from "@/lib/prisma";

const getInventory = async (serachParams: AwaitedPageProps['searchParams']) => {
    return prisma.classified.findMany({
        include: { images: true },
    });
}
export default async function InventoryPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const classifieds = await getInventory(searchParams);
    const count = await prisma.classified.count();
    // console.log(count);
    return (
        <>
          <ClassifiedList classifieds={classifieds} />
        </>
    )
}