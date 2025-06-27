'use client'
import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select } from "../ui/select";
import { formatBodyType, formatColour, formatFuelType, formatTransmission, formatUlezCompliance, generateYaars } from "@/lib/utils";
import { TaxonomySelects } from "./taxonomy-select";
import { InputSelect } from "../ui/input-select";
import { BodyType, Colour, CurrencyCode, FuelType, OdoUnit, Transmission, ULEZCompliance } from "@prisma/client";
import { Input } from "../ui/input";
import { NumberInput } from "../ui/number-input";
import dynamic from 'next/dynamic';
import { Skeleton } from "../ui/skeleton";

const RichTextEditor = dynamic(() => import("./rich-text-editor").then((mod) => mod.RichTextEditor), {
    ssr: false,
    loading: () => (
        <div className="space-y-2 flex flex-col">
            <Skeleton className="w-24 h-4 bg-primary-800" />
            <Skeleton className="w-full h-[200px] bg-primary-800" />
        </div>
    )
})

const years = generateYaars(1925);

export const ClassifiedFormFields = () => {
    const form = useFormContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="year"
                render={({ field: { ref, ...rest } }) => (
                    <FormItem>
                        <FormLabel htmlFor="year">Year</FormLabel>
                        <FormControl>
                            <Select selectClassName="text-gray-500 bg-primary-600 border-transparent"
                                options={years.map((year) => ({
                                    label: year,
                                    value: year,
                                }))}
                                {...rest}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <TaxonomySelects />
            <InputSelect
                options={Object.values(CurrencyCode).map((value) => ({
                    label: value,
                    value,
                }))}
                label="Price"
                inputName="price"
                selectName="currency"
                inputMode="numeric"
                placeholder="0"
                className="h-10"
            />
            <InputSelect
                options={Object.values(OdoUnit).map((value) => ({
                    label: value,
                    value,
                }))}
                label="Odometer reading"
                inputName="odoReading"
                selectName="odoUnit"
                inputMode="numeric"
                placeholder="0"
                className="h-10"
            />
            <FormField
                control={form.control}
                name="transmission"
                render={({ field: { ref, ...rest } }) => (
                    <FormItem>
                        <FormLabel htmlFor="transmission">Transmission</FormLabel>
                        <FormControl>
                            <Select selectClassName="text-gray-500 bg-primary-600 border-transparent"
                                options={Object.values(Transmission).map((value) => ({
                                    label: formatTransmission(value),
                                    value,
                                }))}
                                {...rest}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="fuelType"
                render={({ field: { ref, ...rest } }) => (
                    <FormItem>
                        <FormLabel htmlFor="transmission">Fuel type</FormLabel>
                        <FormControl>
                            <Select selectClassName="text-gray-500 bg-primary-600 border-transparent"
                                options={Object.values(FuelType).map((value) => ({
                                    label: formatFuelType(value),
                                    value,
                                }))}
                                {...rest}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="bodyType"
                render={({ field: { ref, ...rest } }) => (
                    <FormItem>
                        <FormLabel htmlFor="transmission">Body type</FormLabel>
                        <FormControl>
                            <Select selectClassName="text-gray-500 bg-primary-600 border-transparent"
                                options={Object.values(BodyType).map((value) => ({
                                    label: formatBodyType(value),
                                    value,
                                }))}
                                {...rest}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="colour"
                render={({ field: { ref, ...rest } }) => (
                    <FormItem>
                        <FormLabel htmlFor="transmission">Colour</FormLabel>
                        <FormControl>
                            <Select selectClassName="text-gray-500 bg-primary-600 border-transparent"
                                options={Object.values(Colour).map((value) => ({
                                    label: formatColour(value),
                                    value,
                                }))}
                                {...rest}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="ulezcompliance"
                render={({ field: { ref, ...rest } }) => (
                    <FormItem>
                        <FormLabel htmlFor="transmission">ULEZ Compliance</FormLabel>
                        <FormControl>
                            <Select selectClassName="text-gray-500 bg-primary-600 border-transparent"
                                options={Object.values(ULEZCompliance).map((value) => ({
                                    label: formatUlezCompliance(value),
                                    value,
                                }))}
                                {...rest}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="vrm"
                render={({ field: { ref, ...rest } }) => (
                    <FormItem>
                        <FormLabel htmlFor="vrm">Vehicle Registration Mark</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="LA16 PYW"
                                className="uppercase text-muted h-10 mt-1 bg-primary-800 border-transparent placeholder:text-muted/75"
                                {...rest}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="doors"
                render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                        <FormLabel htmlFor="doors">Doors</FormLabel>
                        <FormControl>
                            <NumberInput
                                max={6}
                                min={1}
                                placeholder="0"
                                style={{ background: "#081a2b" }}
                                className="text-muted/75 placeholder:text-muted/75"
                                onValueChange={(values) => {
                                    onChange(values.floatValue)
                                }}
                                {...rest}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="seats"
                render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                        <FormLabel htmlFor="seats">Seats</FormLabel>
                        <FormControl>
                            <NumberInput
                                max={8}
                                min={4}
                                placeholder="0"
                                style={{ background: "#081a2b" }}
                                className="text-muted/75 placeholder:text-muted/75"
                                onValueChange={(values) => {
                                    onChange(values.floatValue)
                                }}
                                {...rest}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="col-span-2">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field: { onChange, ...rest } }) => (
                        <FormItem>
                            <FormControl>
                              <RichTextEditor
                              label="Description"
                              config={{
                                init:{placeholder:"Enter your vehicles descrition"},
                            }}
                            {...rest}
                              />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}