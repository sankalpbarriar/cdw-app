import { AwaitedPageProps } from '@/config/types'
import React from 'react'
import { HomePageTaxonomyFilters } from './home-page-filters'
import { imgixLoader } from '@/lib/imgix-loader'
import { imageSource } from '@/config/constants'
import { SearchButton } from './search-button'
import { prisma } from '@/lib/prisma'
import { buildClassifiedFilterQuery } from '@/lib/utils'
import { Button } from '../ui/button'
import Link from 'next/link'
import { routes } from '@/config/routes'
import { ClassifiedStatus } from '@prisma/client'

export const HeroSection = async (props: AwaitedPageProps) => {

    const { searchParams } = props;
    const totatlFiltersApplied = Object.keys(searchParams || {}).length;
    const isFilterApplied = totatlFiltersApplied > 0;

    const classifiedCount = await prisma.classified.count({
        where: buildClassifiedFilterQuery(searchParams)
    })

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
                odoReading: true
            },
        })


    return (
        <section
            className="relative flex items-center justify-center h-[calc(100vh-4rem)] bg-cover bg-center"
            style={{
                backgroundImage: `url(${imgixLoader({
                    src: imageSource.carLinup,
                    width: 1280, quality: 150
                })})`
            }}
        >
            <div className="absolute inset-0 bg-black opacity-75" />
            <div className="container lg:grid space-y-12 grid-cols-2 items-center relative z-10">
                <div className="px-10 lg:px-0">
                    <h1 className="text-2xl text-center lg:text-left md:text-3xl lg:text-8xl uppercase font-extrabold text-white">Unbeatable Deals on new and used cars
                    </h1>
                    <h2 className="mt-4 uppercase text-center lg:text-left text-base md:text-3xl lg:text-4xl text-white">Discover your dream car today
                    </h2>
                </div>
                <div className="max-w-md w-full mx-auto p-6 bg-white sm:rounded-xl shadow-lg">
                    <div className="space-y-4">
                        <div className="space-y-2 flex flex-col w-full gap-x-4 text-black">
                            <HomePageTaxonomyFilters searchParams={searchParams} minMaxValues = {minMaxResult} />
                        </div>
                        <SearchButton count={classifiedCount} />
                        {isFilterApplied && (
                            <Button
                                asChild
                                variant="outline"
                                className='w-full hover:bg-slate-200 text-black'
                            >
                                <Link href={routes.home}>Clear Filters ({totatlFiltersApplied})</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
