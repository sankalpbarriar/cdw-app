import { navLinks } from "@/config/constants";
import { routes } from "@/config/routes";
import { SiGithub, SiInstagram, SiMeta, SiX } from "@icons-pack/react-simple-icons";
import Image from "next/image";
import Link from "next/link";
import { NewsLetterForm } from "../shared/newsletter-form";
const socialLinks = [
    {
        id: 1,
        href: "https://facebook.com",
        icon: (
            <SiMeta className="w-5 h-5 text-gray-600 hover:text-primary transition-colors" />
        ),
    },
    {
        id: 2,
        href: "https://twitter.com",
        icon: (
            <SiX className="w-5 h-5 text-gray-600 hover:text-primary transition-colors" />
        ),
    },
    {
        id: 3,
        href: "https://instagram.com",
        icon: (
            <SiInstagram className="w-5 h-5 text-gray-600 hover:text-primary transition-colors" />
        ),
    },
    {
        id: 4,
        href: "https://github.com/sankalpbarriar",
        icon: (
            <SiGithub className="w-5 h-5 text-gray-600 hover:text-primary transition-colors" />
        ),
    },
];
export const PublicFooter = () => {
    return (
        <footer className="bg-gray-100 px-8 lg:px-0 py-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col space-x-2 gap-y-2">
                    <Link className="flex items-center" href={routes.home}>
                        <Image
                            width={300}
                            height={100}
                            alt="logo"
                            className="h-8 relative"
                            src="/logo-footer.svg"
                        />
                    </Link>
                    <div className="flex space-x-4">
                        {socialLinks.map((link) => {
                            return (
                                <Link href={link.href} key={link.id}>
                                    {link.icon}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <ul className="space-y-1 text-gray-600">
                    {navLinks.map((link) => (
                        <li key={link.id}>
                            <Link
                                href={link.href}
                                className="text-foreground hover:text-primary"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link
                            href={routes.home}
                            className="text-foreground hover:text-primary"
                        >
                            Admin
                        </Link>
                    </li>
                </ul>

                <NewsLetterForm />
            </div>
            <div className="container mx-auto mt-8 text-center text-gray-700">
                <h4 className="text-lg font-bold text-primary">Company Info</h4>
                <p>Company No. 123456789 | GST No. GB123456789</p>
                <p>
                    Velocity Motors is not authorised and not regulated by the Financial
                    Conduct Authority
                </p>
            </div>
        </footer>
    );
};