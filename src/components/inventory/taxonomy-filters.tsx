'use client'

import { AwaitedPageProps, FilterOptions, TaxonomyFilterProps } from "@/config/types"
import { ChangeEvent, useEffect, useState } from "react"
import { Select } from "../ui/select";
import { endpoints } from "@/config/exdpoints";
import { api } from "@/lib/api-client";

export const TaxonomyFilter = (props: TaxonomyFilterProps) => {
    const { searchParams, handleChange } = props;
    const [makes, setMakes] = useState<FilterOptions<string, string>>([]);
    const [models, setModels] = useState<FilterOptions<string, string>>([]);
    const [modelVariants, setModelVariants] = useState<
        FilterOptions<string, string>
    >([]);

    useEffect(() => {
        (async function fetchMakesOptions() {
            const params = new URLSearchParams();
            for (const [k, v] of Object.entries(
                searchParams as Record<string, string>,
            )) {
                if (v) params.set(k, v as string);
            }

            const url = new URL(endpoints.taxonomy, window.location.href);

            url.search = params.toString();

            const data = await api.get<{
                makes: FilterOptions<string, string>;
                models: FilterOptions<string, string>;
                modelVariants: FilterOptions<string, string>;
            }>(url.toString());

            setMakes(data.makes);
            setModels(data.models);
            setModelVariants(data.modelVariants);
        })();
    }, [searchParams]);
    return <>
        <Select
            label="Make"
            name="make"
            value={searchParams?.make as string}
            onChange={handleChange}
            options={makes}
        />
        <Select
            label="Model"
            name="model"
            value={searchParams?.model as string}
            onChange={handleChange}
            options={models}
            disabled={!models.length}
        />
        <Select
            label="Model Varaint"
            name="modelVariant"
            value={searchParams?.modelVariant as string}
            onChange={handleChange}
            options={modelVariants}
            disabled={!modelVariants.length}
        />
    </>
}