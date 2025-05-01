'use client'
import { AwaitedPageProps, SidebarProps } from "@/config/types";
import { parseAsString, useQueryStates } from "nuqs";
import { TaxonomyFilter } from "../inventory/taxonomy-filters";
import { RangeFilter } from "../inventory/range-filter";

interface HomePageTaxonomyFiltersProps extends SidebarProps { }
export const HomePageTaxonomyFilters = ({ searchParams, minMaxValues }: HomePageTaxonomyFiltersProps) => {
    const { _min, _max } = minMaxValues
    const [, setState] = useQueryStates({
        make: parseAsString.withDefault(""),
        model: parseAsString.withDefault(""),
        modelVariant: parseAsString.withDefault(""),
        minYear: parseAsString.withDefault(""),
        maxYear: parseAsString.withDefault(""),
        minPrice: parseAsString.withDefault(""),
        maxPrice: parseAsString.withDefault(""),
    },
        { shallow: false });

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        //if we set the make we need to reset the model and modelvaraint
        switch (name) {
            case "make":
                await setState({ make: value, model: null, modelVariant: null });
                break;
            case "model":
                await setState({ model: value, modelVariant: null });
                break;
            default:
                await setState({ [name]: value })
        }
    }
    return (
        <>
            <TaxonomyFilter handleChange={handleChange}
                searchParams={searchParams}
            />
            <RangeFilter
                label="Year"
                minName="minYear"
                maxName="maxYear"
                defaultMin={_min.year || 1925}
                defaultMax={_max.year || new Date().getFullYear()}
                searchParams={searchParams}
                handleChange={handleChange}
            />
            <RangeFilter
                label="Price"
                minName="minPrice"
                maxName="maxPrice"
                defaultMin={_min.price || 0}
                defaultMax={_max.price || 2147836}
                searchParams={searchParams}
                increment={1000000}
                thousandSeparator
                currency={{
                    currencyCode: "INR",
                }}
                handleChange={handleChange}
            />
        </>
    )
}