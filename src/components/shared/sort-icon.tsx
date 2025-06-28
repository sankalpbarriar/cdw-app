//dynamically generated icon which will be pointing in direction on the basis of how it is sorted [up,down]

import { ArrowUpDown, ArrowUpNarrowWide } from "lucide-react";

interface SortIconProps<TKeys> {
    sort: TKeys;
    currentSort: TKeys | null;
    currentOrder: "asc" | "desc" | null;
}
export function SortIcon<TKeys>(props: SortIconProps<TKeys>) {
    const { sort, currentOrder, currentSort } = props;

    if (sort !== currentSort) return <ArrowUpDown className="h-4 w-4" />  //haven't sorted yet

    return currentOrder === "asc" ? (
        <ArrowUpNarrowWide className="w-4 h-4" />
    ) : (
        <ArrowUpNarrowWide className="w-4 h-4 rotate-180" />
    )
}