import { routes } from "@/config/routes"
import Image from "next/image"
import Link from "next/link"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { HeartIcon, MenuIcon } from "lucide-react"
import { redis } from "@/lib/redis-store"
import { Favourites } from "@/config/types"
import { getSouceId } from "@/lib/source-id"
import { navLinks } from "@/config/constants"


export const PublicHeader = async() => {
    const sourceId = await getSouceId();
    const favourites = await redis.get<Favourites>(sourceId ?? "")
    return (
        <header className="flex items-center justify-between h-16 px-4 bg-transparent gap-x-6">
            <div className="flex items-center flex-1">
                <Link href={routes.home} className="flex items-center gap-2">
                    <Image
                        width={315}
                        height={100}
                        alt="logo"
                        className="relative"
                        src="/logo3.svg"
                    />
                </Link>
            </div>
            <nav className="text-black hidden md:block">
                {navLinks.map((link) => (<Link className="group font-heading rounded px-3 py-2 text-base text-foreground hover:text-primary duration-300 transition-all ease-in-out font-semibold uppercase"
                    href={link.href}
                    key={link.id}
                >
                    {link.label}
                </Link>))}
            </nav>
            <Button asChild variant="ghost" size="icon" className="relative w-10 h-10 inline-block group rounded-full">
                <Link href={routes.favourites}>
                    <div className="flex group-hover:bg-pink-500 duration-200 transition-colors ease-in-out justify-center items-center w-10 h-10 bg-muted rounded-full">
                    <HeartIcon  className="w-6 h-6 text-primary group-hover:text-white group-hover:fill-white"/>
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 text-white bg-pink-500 rounded-full group-hover:bg-primary">
                        <span className="text-xs">
                            {favourites ? favourites.ids.length : 0}{" "}
                        </span>
                    </div>
                </Link>
            </Button>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="link" size="icon" className="md:hidden border-none">
                        <MenuIcon className="h-6 w-6 text-primary" />
                        <SheetTitle className="sr-only">Toggle nav menu</SheetTitle>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full text-gray-600 max-w-xs p-4 bg-white">
                    <nav className="grid gap-2">
                        {navLinks.map((link) => (<Link className="flex items-center gap-2 py-2 font-medium text-sm text-gray-600 hover:text-gray-900"
                            href={link.href}
                            key={link.id}
                        >
                            {link.label}
                        </Link>))}
                    </nav>
                </SheetContent>
            </Sheet>

        </header>
    )
}