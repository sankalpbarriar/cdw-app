import { FilterOptions, TaxonomyFilterProps } from "@/config/types";
import { CurrencyCode } from "@prisma/client";
import { RangeSelect } from "../ui/range-select";
import { useEffect, useState } from "react";
import { formatNumber, formatPrice } from "@/lib/utils";

interface RangeFilterProps extends TaxonomyFilterProps {
    label: string,
    minName: string,
    maxName: string,
    defaultMin: number,
    defaultMax: number,
    increment?: number,
    thousandSeparator?: boolean,
    currency?: {
        currencyCode: CurrencyCode,
    }
}
export const RangeFilter = (props: RangeFilterProps) => {
    const {
        label,
        minName,
        maxName,
        defaultMin,
        defaultMax,
        increment,
        thousandSeparator,
        currency,
        handleChange,
        searchParams
    } = props;


    const getInitialState = () => {
        const state: FilterOptions<string, number> = [];
        let iterator = defaultMin - (increment || 1);

        do {
            if (increment) {
                iterator = iterator + increment;
            }
            else {
                iterator++;
            }
            if (currency) {
                state.push({
                    label: formatPrice({ price: iterator, currency: currency?.currencyCode }),
                    value: iterator,
                })
            }
            else if (thousandSeparator){
                state.push({label:formatNumber(iterator),value: iterator})
            } else {
                state.push({ label: iterator.toString(), value: iterator });
            }
            // state.push({ label: iterator.toString(), value: iterator });
        } while (iterator < defaultMax);

        return state;

    };

    const intitalState = getInitialState()


    const [minOptions, setMinOptions] = useState<FilterOptions<string, number>>(intitalState);
    const [maxOptions, setMaxOptions] = useState<FilterOptions<string, number>>(intitalState.toReversed());

    //dynamically removig and adding the nunbers 
    useEffect(() => {
        if (searchParams?.[minName]) {
            setMaxOptions(
                intitalState.filter(({ value }) => value > Number(searchParams[minName]))
            );
        }
        if (searchParams?.[maxName]) {
            setMinOptions(
                intitalState.filter(({ value }) => value < Number(searchParams[maxName]))
            );
        }

    }, [searchParams?.[minName], searchParams?.[maxName]])

    return (
        <RangeSelect
            label={label}
            minSelect={{
                name: minName,
                value: Number(searchParams?.[minName]) || "",
                onChange: handleChange,
                options: minOptions,
            }}
            maxSelect={{
                name: maxName,
                value: Number(searchParams?.[maxName]) || "",
                onChange: handleChange,
                options: maxOptions,
            }}
        />
    )
}