'use client'
import { parseAsString, useQueryStates } from "nuqs";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/config/routes";
import { env } from "@/env";

export const SearchButton = ({ count }: { count: number }) => {

    const [{ make, model, modelVariant, minYear, maxYear, minPrice, maxPrice }] = useQueryStates({
        make: parseAsString.withDefault(""),
        model: parseAsString.withDefault(""),
        modelVariant: parseAsString.withDefault(""),
        minYear: parseAsString.withDefault(""),
        maxYear: parseAsString.withDefault(""),
        minPrice: parseAsString.withDefault(""),
        maxPrice: parseAsString.withDefault(""),
    },
        { shallow: false }
    );
    const queryParams = new URLSearchParams();
    if (make) queryParams.append("make", make)
    if (model) queryParams.append("make", model)
    if (modelVariant) queryParams.append("make", modelVariant)
    if (minYear) queryParams.append("make", minYear)
    if (maxYear) queryParams.append("make", maxYear)
    if (minYear) queryParams.append("make", minPrice)
    if (maxYear) queryParams.append("make", maxPrice)

    const url = new URL(routes.inventory, env.NEXT_PUBLIC_APP_URL);
    url.search = queryParams.toString();


    return (
        <Button className="w-full" asChild>
            <Link href={url.toString()}
            >Search {count > 0 ? `${count}` : null}</Link>
        </Button>
    )
}