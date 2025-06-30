'use client'
import {CustomerWithClassified } from "@/config/types"
import { startTransition, useTransition } from "react"
import { toast } from "sonner";
import { Button } from "../ui/button";
import { EyeIcon, Loader2, PencilIcon, Trash } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { Tooltip } from 'react-tooltip'
import { deleteCustomerAction } from "@/app/_actions/customer";

export const ActionButtons = ({ customer }: { customer: CustomerWithClassified }) => {
    const [isPending, startTransitions] = useTransition();
    const deleteCustomer = (id: number) => {
        startTransition(async () => {
            const result = await deleteCustomerAction(id);
            if (result.success) {
                toast(
                    <div>
                        <strong className="text-green-600">Customer Deleted</strong>
                        <p className="text-white">{result.message}</p>
                    </div>
                );
            }
            else {
                toast(
                    <div>
                        <strong className="text-red-600">Error Deleting Customer</strong>
                        <p className="text-white">{result.message}</p>
                    </div>
                );
            }
        })
    }

    return <>
        <Button
            variant="destructive"
            className="p-2 h-fit"
            data-tooltip-id="trash-tooltip"
            data-tooltip-content="Delete"
            onClick={() => deleteCustomer(customer.id)}
        >
            <Tooltip id="trash-tooltip" />
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="outline-none" />}
        </Button>

        <Button
            asChild
            className="p-2 h-fit"
            data-tooltip-id="edit-tooltip"
            data-tooltip-content="Edit"
        >
            <Link href={routes.admin.editCustomer(customer.id)}>
                <Tooltip id="edit-tooltip" />
                <PencilIcon className="h-4 w-4 outline-none" />
            </Link>
        </Button>
    </>
}