import { validateIdSchema } from "@/app/schemas/id.schema";
import { ClassifiedForm } from "@/components/classified/classified-form";
import { routes } from "@/config/routes";
import { PageProps } from "@/config/types";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function EditClassfied(props: PageProps) {
    const params = await props.params; //trying to get id from the params

    const { data, success } = validateIdSchema.safeParse({
        id: Number(params?.id)
    });

    if(!success) redirect(routes.admin.classifieds);

    const classified = await prisma.classified.findUnique({
        where:{id: data.id},
        include:{images:true}
    });

    if(!classified) redirect(routes.admin.classifieds);

    console.log({classified})
    return <ClassifiedForm classified={classified}/>
} 