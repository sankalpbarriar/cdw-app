'use client'

import { endpoints } from "@/config/exdpoints";
import { FilterOptions } from "@/config/types";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { api } from "@/lib/api-client";
import { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form"
import { Select } from "../ui/select";

export const TaxonomySelects = () => {
    const form = useFormContext();
    const defaultMake = form.getValues("make") || null;
    const defaultModel = form.getValues("model") || null;

    const [make, setMake] = useState<string | null>(defaultMake)
    const [makes, setMakes] = useState<FilterOptions<string, string>>([])

    const [model, setModel] = useState<string | null>(defaultModel)
    const [models, setModels] = useState<FilterOptions<string, string>>([])

    const [modelVariants, setModelVariants] = useState<FilterOptions<string, string>>([]);

    //fetch those makes from the database
    useEffect(() => {
        (async function fetchMakeOptions() {
            const url = new URL(endpoints.taxonomy, window.location.href);
            if(make) url.searchParams.append("make",make)
            if(model) url.searchParams.append("model",model)

            const data = await api.get<{
                makes: FilterOptions<string, string>;
                models: FilterOptions<string, string>;
                modelVariants: FilterOptions<string, string>;
            }>(url.toString());

            setMakes(data.makes)
            setModels(data.models)
            setModelVariants(data.modelVariants)
        })()
    }, [make, model]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>, onChange: (...event: any[]) => void) => {
        switch (e.target.name) {
            case "make":
                setMake(e.target.value);
                break;
            case "model":
                setModel(e.target.value);
                break;
        }

        return onChange(e)
    };
    return (
        <>
            <FormField
                control={form.control}
                name="make"
                render={({ field: { onChange, ref, ...rest } }) => (
                    <FormItem>
                        <FormLabel htmlFor="year">Make</FormLabel>
                        <FormControl>
                            <Select selectClassName="text-gray-500 bg-primary-600 border-transparent"
                                options={makes}
                                onChange={(e) => handleChange(e, onChange)}
                                {...rest}    
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="model"
                render={({ field: { onChange, ref, ...rest } }) => (
                    <FormItem>
                        <FormLabel htmlFor="year">Model</FormLabel>
                        <FormControl>
                            <Select selectClassName="text-gray-500 bg-primary-600 border-transparent"
                                options={models}
                                onChange={(e) => handleChange(e, onChange)}
                                {...rest}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="modelVarinat"
                render={({ field: { onChange, ref, ...rest } }) => (
                    <FormItem>
                        <FormLabel htmlFor="year">Model Varinat</FormLabel>
                        <FormControl>
                            <Select selectClassName="text-gray-500 bg-primary-600 border-transparent"
                                options={modelVariants}
                                onChange={(e) => handleChange(e, onChange)}
                                {...rest}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
} 