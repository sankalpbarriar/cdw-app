import { CarIcon, HomeIcon } from "lucide-react"
import { Button } from "../ui/button"
import { routes } from "@/config/routes"
import Link from "next/link"

export const EndButtons = () => {
    return (
        <div className="mt-6 flex items-center justify-center gap-4">
            <Button
                variant='outline'
                className="transition-colors bg-white hover:bg-primary hover:text-white"
                asChild
            >
                <Link
                    href={routes.home}
                    className="text-gray-600">
                    <HomeIcon className="mr-2 h-5 w-5" />
                    Go to home page</Link>
            </Button>
            <Button
                asChild
            >
                <Link
                    href={routes.inventory}>
                    <CarIcon className="mr-2 h-5 w-5" />
                    View Classifieds</Link>
            </Button>
        </div>
    )
}