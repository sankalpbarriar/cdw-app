'use client';

import { routes } from "@/config/routes";
import { AwaitedPageProps } from "@/config/types";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { ChangeEvent, useEffect, useState } from "react";
import { SearchInput } from "./search-input";
import { TaxonomyFilter } from "./taxonomy-filters";

interface SidebarProps extends AwaitedPageProps {
    minMaxValues: any,
}
export const Sidebar = ({ minMaxValues, searchParams }: SidebarProps) => {
    const router = useRouter();
    const [filterCount, setFilterCount] = useState(0);

    //Instead of using useState() to store data only in memory, useQueryState() persists that state in the URL, making it shareable, bookmarkable, and browser navigation-friendly.
    const [querState, setQuerStates] = useQueryStates({
        make: parseAsString.withDefault(""),
        model: parseAsString.withDefault(""),
        modelVariant: parseAsString.withDefault(""),
        minYear: parseAsString.withDefault(""),
        maxYear: parseAsString.withDefault(""),
        minPrice: parseAsString.withDefault(""),
        maxPrice: parseAsString.withDefault(""),
        minReading: parseAsString.withDefault(""),
        maxReading: parseAsString.withDefault(""),
        currency: parseAsString.withDefault(""),
        transmission: parseAsString.withDefault(""),
        fuelType: parseAsString.withDefault(""),
        bodyType: parseAsString.withDefault(""),
        colour: parseAsString.withDefault(""),
        doors: parseAsString.withDefault(""),
        seats: parseAsString.withDefault(""),
        compliance: parseAsString.withDefault(""),
    }, {
        shallow: false
    })

    //count how many filters are applied
    useEffect(() => {
        const filterCount = Object.entries(searchParams as Record<string, string>,
        ).filter(([key, value]) => key !== 'page' && value).length

        setFilterCount(filterCount)
    }, [searchParams]);

    const clearFilters = () => {
        const url = new URL(routes.inventory, env.NEXT_PUBLIC_APP_URL);
        window.location.replace(url.toString())
        setFilterCount(0);
    };

    const handleChange = async (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setQuerStates({
            [name]: value || null
        })

        if (name === "make") {
            setQuerStates({
                model: null,
                modelVariant: null,
            })
        }
        router.refresh();
    };


    return (
        <div className="py-4 w-[21.25rem] text-black bg-white border-r border-muted block">
            <div>
                <div className="text-lg font-semibold flex justify-between px-4">
                    <span>Filters</span>
                    <button
                        type="button"
                        onClick={clearFilters}
                        disabled={filterCount === 0}
                        className={cn("text-sm text-gray-500 py-1", !filterCount ? "disabled:opacity-50 pointer-events-none cursor:default" : "hover:underline cursor-pointer")}>
                        Clear all {filterCount ? `(${filterCount})` : null}
                    </button>
                </div>
                <div className="mt-2" />
            </div>
            <div className="p-4">
                <SearchInput
                    placeholder="Search classifieds.."
                    className="w-full px-3 py-2 border rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue:500" />
            </div>
            {/* taxnomy filters */}
            <div className="p-4 space-y-2">
                <TaxonomyFilter searchParams={searchParams} handleChange={handleChange} />
            </div>
        </div>
    )
}