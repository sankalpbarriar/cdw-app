import { PropsWithChildren } from "react";
import { PublicHeader } from "./header";
import { PublicFooter } from "./footer";

export function PublicLayout({children} : PropsWithChildren){
    return <>
    {/* header */}
    <PublicHeader/>
    <main className="bg-white">{children}</main>
    {/* footer */}
    <PublicFooter/>
    </>
}