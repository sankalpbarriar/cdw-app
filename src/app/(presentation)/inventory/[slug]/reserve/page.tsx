import { MultiStepFormSchema } from "@/app/schemas/form.schema";
import { SelectDate } from "@/components/reserve/select-date";
import { SubmitDetails } from "@/components/reserve/submit-details";
import { Welcome } from "@/components/reserve/welcome";
import { MultiStepFormEnum, PageProps } from "@/config/types";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

//schema

const MAP_STEP_TO_COMPOENET = {
    [MultiStepFormEnum.WELCOME]: Welcome,
    [MultiStepFormEnum.SELECT_DATE]: SelectDate,
    [MultiStepFormEnum.SUBMIT_DETAILS]: SubmitDetails,
}
export default async function ReservePage(props: PageProps) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const slug = params?.slug;
    const step = searchParams?.step;

    const { data, success, error } = MultiStepFormSchema.safeParse({
        slug,
        step: Number(step),
    });

    if (!success) {
        console.log(error);
        notFound();
    }

    const classified = await prisma.classified.findUnique({
        where: { slug: data.slug },
        include: { make: true }
    })

    if (!classified) notFound();

    const Component = MAP_STEP_TO_COMPOENET[data.step]

    return <Component searchParams={searchParams} params={params} classified={classified} />



}