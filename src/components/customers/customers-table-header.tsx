"use client";

import { sortOrder } from "@/config/constants";
import type { ClassifiedKeys, CustomerKeys, PageProps } from "@/config/types";
import type { Classified, Customer } from "@prisma/client";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { SortIcon } from "../shared/sort-icon";
import { TableHead, TableHeader, TableRow } from "../ui/table";

const customersKeys = [
    "id",
    "email",
    "mobile",
    "firstName",
    "lastName",
    "updatedAt",
    "createdAt",
    "status",
    "bookingDate",
    "classified",
] as const;

interface CustomersTableProps extends PageProps {
    customers: Customer[];
    sort: CustomerKeys;
    order: "asc" | "desc";
    currentPage: number;
    totalPages: number;
}

type CustomersTableHeaderProps = Pick<CustomersTableProps, "sort" | "order">;

export const CustomersTableHeader = (props: CustomersTableHeaderProps) => {
    const { sort: initialSort, order: initialOrder } = props;
    const [sort, setSort] = useQueryState(
        "sort",
        parseAsStringLiteral(customersKeys)
            .withDefault(initialSort)
            .withOptions({ shallow: false }),
    );
    const [order, setOrder] = useQueryState(
        "order",
        parseAsStringLiteral(sortOrder)
            .withDefault(initialOrder)
            .withOptions({ shallow: false }),
    );

    const handleSort = (newSort: CustomerKeys) => {
        if (newSort === sort) {
            setOrder(order === "asc" ? "desc" : "asc");
        } else {
            setSort(newSort);
            setOrder("asc");
        }
    };

    return (
        <TableHeader>
            <TableRow className="hover:bg-transparent border-primary-800">
                <TableHead className="text-muted w-[80px]">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleSort("id")}
                        onKeyDown={() => handleSort("id")}
                    >
                        ID
                        <SortIcon<CustomerKeys>
                            currentSort={sort}
                            currentOrder={order as "asc" | "desc" | null}
                            sort="id"
                        />
                    </div>
                </TableHead>
                <TableHead className="text-muted w-[150px]">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleSort("status")}
                        onKeyDown={() => handleSort("status")}
                    >
                        Status
                        <SortIcon<CustomerKeys>
                            currentSort={sort}
                            currentOrder={order as "asc" | "desc" | null}
                            sort="status"
                        />
                    </div>
                </TableHead>
                <TableHead className="text-muted w-[150px]">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleSort("firstName")}
                        onKeyDown={() => handleSort("firstName")}
                    >
                        Name
                        <SortIcon<CustomerKeys>
                            currentSort={sort}
                            currentOrder={order as "asc" | "desc" | null}
                            sort="firstName"
                        />
                    </div>
                </TableHead>
                <TableHead className="text-muted w-[150px]">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleSort("email")}
                        onKeyDown={() => handleSort("email")}
                    >
                        Email
                        <SortIcon<CustomerKeys>
                            currentSort={sort}
                            currentOrder={order as "asc" | "desc" | null}
                            sort="email"
                        />
                    </div>
                </TableHead>
                <TableHead className="text-muted w-[150px]">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleSort("mobile")}
                        onKeyDown={() => handleSort("mobile")}
                    >
                        Mobile
                        <SortIcon<CustomerKeys>
                            currentSort={sort}
                            currentOrder={order as "asc" | "desc" | null}
                            sort="mobile"
                        />
                    </div>
                </TableHead>
                <TableHead className="text-muted max-w-[150px]">Classifieds</TableHead>
                <TableHead className="text-muted hidden md:table-cell">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleSort("createdAt")}
                        onKeyDown={() => handleSort("createdAt")}
                    >
                        Date Created
                        <SortIcon<CustomerKeys>
                            currentSort={sort}
                            currentOrder={order as "asc" | "desc" | null}
                            sort="createdAt"
                        />
                    </div>
                </TableHead>
                <TableHead className="text-muted hidden md:table-cell">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleSort("updatedAt")}
                        onKeyDown={() => handleSort("updatedAt")}
                    >
                        Date Updated
                        <SortIcon<CustomerKeys>
                            currentSort={sort}
                            currentOrder={order as "asc" | "desc" | null}
                            sort="updatedAt"
                        />
                    </div>
                </TableHead>
                <TableHead className="text-muted hidden md:table-cell">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleSort("bookingDate")}
                        onKeyDown={() => handleSort("bookingDate")}
                    >
                        Booking Date
                        <SortIcon<CustomerKeys>
                            currentSort={sort}
                            currentOrder={order as "asc" | "desc" | null}
                            sort="bookingDate"
                        />
                    </div>
                </TableHead>
                
                <TableHead className="text-muted w-[100px]">Actions</TableHead>
            </TableRow>
        </TableHeader>
    );
};