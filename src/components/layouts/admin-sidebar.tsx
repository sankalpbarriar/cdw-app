'use client'
import { AnimatePresence, Variants } from "framer-motion";
import { useCallback, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link";
import { routes } from "@/config/routes";
import Image from "next/image";
import { CarFrontIcon, LayoutDashboard, LucideSettings, UsersIcon } from "lucide-react";
import { ActiveLink } from "../ui/active-link";

const navigation = [
    {
        name: "Dashboard",
        href: routes.admin.dashboard,
        icon: LayoutDashboard,
    },
    {
        name: "Classifieds",
        href: routes.admin.classifieds,
        icon: CarFrontIcon,
    },
    {
        name: "Customers",
        href: routes.admin.customers,
        icon: UsersIcon,
    },
    {
        name: "Settings",
        href: routes.admin.settings,
        icon: LucideSettings,
    },
]

export const AdminSideBar = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const handleSidebarHover = useCallback((expanded: boolean) => {
        setIsSidebarExpanded(expanded)
    }, []);

    const sidebarVariants: Variants = {
        expanded: { width: 256 },
        collapsed: { width: "fit-content" }
    };

    const menuTextVariants: Variants = {
        expanded: {
            opacity: 1,
            width: 'auto',
            marginLeft: 10,
        },
        collapsed: {
            opacity: 0,
            width: 0,
        }
    };

    const logoVariants: Variants = {
        inital: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    };

    return <motion.div className="bg-black/20 h-screen overflow-hidden flex flex-col" animate={isSidebarExpanded ? 'expanded' : 'collapsed'}
        variants={sidebarVariants}
        initial="collapsed"
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => handleSidebarHover(true)}
        onMouseLeave={() => handleSidebarHover(false)}
    >
        <div className="flex flex-col grow px-4">
            <Link href={routes.home}>
                <div className="relative h-[60px] w-full">
                    <AnimatePresence initial={false} mode="wait">
                        {isSidebarExpanded ? (
                            <motion.div key="expanded-logo" className="absolute inset-0" variants={logoVariants} initial='initial' animate='animate' exit='exit' transition={{ diration: 0.4 }}>
                                <Image alt="velocity-motors-logo" src="/logo7.png" fill={true} className="object-contain object-left" />
                            </motion.div>
                        ) : (
                            <motion.div key="collapsed-logo" className="absolute inset-0" variants={logoVariants} initial='initial' animate='animate' exit='exit' transition={{ diration: 0.1 }}>
                                <Image alt="velocity-motors-mobile-logo" src="/logo8.png" fill={true} className="object-contain object-left" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Link>
            <nav className="flex flex-col gap-2">
                {navigation.map((item) => {
                    return <ActiveLink href={item.href} key={item.name} className="flex items-center p-2 rounded-lg transition-colors duration-200 w-full cursor-pointer">
                        <div className="flex items-center justify-center">
                            <item.icon aria-hidden="true" className="h-6 w-6 shrink-0" />
                            <motion.span variants={menuTextVariants} animate={isSidebarExpanded ? "expanded" : "collapsed"} initial="collapsed" transition={{duration:0.3,ease:"easeInOut"}} className="whitespace-nowrap overflow-hidden">{item.name}</motion.span>
                        </div>

                    </ActiveLink>
                })}
            </nav>
        </div>
    </motion.div>
}