import { EndButtons } from "@/components/shared/end-buttons";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { CarIcon, Home, XCircle } from "lucide-react";
import Link from "next/link";

export default function NotAvailable() {
    return (
        <div className="flex items-center justify-center min-h-[80dvh]">
            <div className="w-full max-w-lg rounded-lg bg-card shadow-lg">
                <h1 className="bg-primary text-primary-foreground text-lg font-semibold p-4 rounded-t-lg">
                    Vehicle Not available
                </h1>
                <div className="flex flex-col items-center p-8 space-y-4">
                    <XCircle className="w-16 h-16 text-muted-foreground" />
                    <p className="text-lg text-gray-600 font-semibold text-center">
                        Sorry, that vehicle is no longer available.
                    </p>
                    <p className="text-center text-muted-foreground">
                        We have a large verhicle of other vehicles that might suit your need,
                        to view our current stock please check our website
                    </p>
                    <EndButtons/>
                </div>
            </div>
        </div>
    )
}