'use client'
import { ClassifiedWithImages } from "@/config/types"
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateClassifedType, updateClassifiedSchema } from "@/app/schemas/classified.schema";
import { updateClassifiedAction } from "@/app/_actions/classified";
import { toast } from "sonner";
import { ClassifiedFormFields } from "./classified-form-fields";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { ClassifiedStatus, CurrencyCode, OdoUnit } from "@prisma/client";
import { Select } from "../ui/select";
import { MAX_IMAGES } from "@/config/constants";
import { formatClassifiedStatus } from "@/lib/utils";
import { MultiImageUploader } from "./multi-image-uploader";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface ClassifiedFormProps {
    classified: ClassifiedWithImages;
}


//extract the key of url where it contans uploads otherwise return url
function extractKey(url: string) {
    const nextUrl = new URL(url);
    nextUrl.href = url;

    const regex = /uploads\/.+/;
    const match = url.match(regex);
    return match ? match[0] : url;
}
export const ClassifiedForm = ({ classified }: ClassifiedFormProps) => {
    const [isPending, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(updateClassifiedSchema),
        defaultValues: {
            id: classified.id,
            odoUnit: OdoUnit.KILOMETER,
            currency: CurrencyCode.INR,
            ...(classified && {
                images: classified.images ? classified.images.map((image, index) => ({
                    ...image,
                    id: index + 1,
                    percentage: 100,
                    key: extractKey(image.src),
                    done: true,
                })) : [],
                make: classified.makeId.toString(),
                model: classified.modelId.toString(),
                modelVariant: classified.modelVariantId?.toString(),
                year: classified.year.toString(),
                vrm: classified.vrm ?? "",
                description: classified.description ?? "",
                fuelType: classified.fuelType,
                bodyType: classified.bodyType,
                transmission: classified.transmission,
                colour: classified.colour,
                status: classified.status,
                ulezCompliance: classified.ulezCompliance,
                seats: classified.seats,
                doors: classified.doors,
                price: classified.price / 100,
            })

        }
    });

    const classifiedFormSubmit: SubmitHandler<UpdateClassifedType> = (data) => {
        startTransition(async () => {
            const { success, message } = await updateClassifiedAction(data);
            if (!success) {
                toast(
                    <div>
                        <strong className="text-red-600">Error</strong>
                        <p className="text-white">{message}</p>
                    </div>
                );
                return;
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(classifiedFormSubmit)}>
                <h1 className="text-3xl font-bold text-muted mb-6">Upload Vehicle</h1>
                <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ClassifiedFormFields />
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field: { name, onChange } }) => (
                                <FormItem>
                                    <FormLabel className="text-muted" htmlFor="images">Images (up to {MAX_IMAGES})</FormLabel>
                                    <FormControl>
                                        <MultiImageUploader name={name} onChange={onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field: { ref, ...rest } }) => (
                                <FormItem>
                                    <FormLabel htmlFor="status">Status</FormLabel>
                                    <FormControl>
                                        <Select

                                            options={Object.values(ClassifiedStatus).map((value) => ({
                                                label: formatClassifiedStatus(value),
                                                value,
                                            }))}
                                            noDefault={false}
                                            selectClassName="bg-primary-800 border-transparent text-muted/75"
                                            {...rest}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                        type="submit"
                        className="w-full flex gap-x-2"
                        disabled={isPending}
                        >Submit {isPending && <Loader2 className="animate-spin h-4 w-4"/>}</Button>

                    </div>
                </div>
            </form>
        </Form>
    )
}