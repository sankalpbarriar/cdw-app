import { AdminClassifiedHeader } from "@/components/admin/classified/classified-headers";
import { PageProps } from "@/config/types";

export default async function ClassifiedsPage(props:PageProps){
    const searchParams = await props.searchParams;
    return (
        <AdminClassifiedHeader searchParams={searchParams}/>
    )
}