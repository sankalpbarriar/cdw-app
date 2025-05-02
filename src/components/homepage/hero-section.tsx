import { imageSource } from "@/config/constants";
import { routes } from "@/config/routes";
import type { AwaitedPageProps } from "@/config/types";
import { imgixLoader } from "@/lib/imgix-loader";
import { prisma } from "@/lib/prisma";
import { buildClassifiedFilterQuery } from "@/lib/utils";
import { ClassifiedStatus } from "@prisma/client";
import Link from "next/link";
import { Button } from "../ui/button";
import { SearchButton } from "./search-button";
import { HomePageTaxonomyFilters } from "./home-page-filters";

export const HeroSection = async (props: AwaitedPageProps) => {
    const { searchParams } = props;
    const totalFiltersApplied = Object.keys(searchParams || {}).length;
    const isFilterApplied = totalFiltersApplied > 0;

    const classifiedsCount = await prisma.classified.count({
        where: buildClassifiedFilterQuery(searchParams),
    });

    const minMaxResult = await prisma.classified.aggregate({
        where: { status: ClassifiedStatus.LIVE },
        _min: {
            year: true,
            price: true,
            odoReading: true,
        },
        _max: {
            price: true,
            year: true,
            odoReading: true,
        },
    });

    return (
        <section
            className="relative flex items-center justify-center min-h-[100dvh] bg-cover bg-center px-4 sm:px-6"
            style={{
                backgroundImage: `url(${imgixLoader({ src: imageSource.carLinup, width: 1280, quality: 100 })})`,
            }}
        >
            <div className="absolute inset-0 bg-black opacity-75" />
            <div className="relative z-10 container grid grid-cols-1 md:grid-cols-2 items-center gap-12 py-12">
                {/* Left: Headings */}
                <div className="text-center lg:text-left px-2 sm:px-4">
                    <h1 className="text-3xl sm:text-5xl lg:text-8xl font-extrabold text-white uppercase">
                        Experience the Joy of a New Ride
                    </h1>
                    <h2 className="mt-4 text-lg sm:text-2xl lg:text-4xl text-white uppercase leading-snug">
                        Discover your dream car today
                    </h2>
                </div>

                {/* Right: Filters */}
                <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
                    <div className="space-y-4">
                        <div className="flex flex-col space-y-2 text-black">
                            <HomePageTaxonomyFilters
                                minMaxValues={minMaxResult}
                                searchParams={searchParams}
                            />
                        </div>
                        <SearchButton count={classifiedsCount} />
                        {isFilterApplied && (
                            <Button
                                asChild
                                variant="outline"
                                className="w-full hover:bg-slate-200 text-gray-500"
                            >
                                <Link href={routes.home}>
                                    Clear Filters ({totalFiltersApplied})
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};