// 'use client'
// import { useFormStatus } from "react-dom"
// import { Button } from "../ui/button"
// import { Loader2 } from "lucide-react";
// import { useActionState } from "react";
// import { logoutOfAllSessions } from "@/app/_actions/sign-out";

// const LogoutButton = () => {
//     const { pending } = useFormStatus();
//     return (
//         <div className="mt-8 flex">
//             <Button
//                 disabled={pending}
//                 className="flex items-center gap-x-2"
//                 variant="destructive"
//                 type="submit"
//             >
//                 {pending && (<Loader2 className="w-4 h-4 animate-spin" />)}
//                 {pending ? "Logging out ..." : "Loging out of all Sessions"}
//             </Button>
//         </div>
//     )
// }

// export const SettingsPageContent = () => {
//     const [,_formAction] = useActionState(logoutOfAllSessions,null)
//     return (
//         <div className="divide-y divide-white/5 px-6">
//             <div className="grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-3">
//                 <div>
//                     <h2 className="text-base font-semibold leading-7 text-muted">Logout of all sessions</h2>
//                     <p className="mt-1 text-sm leading-6 text-muted/75">This will log you out of all of your sessions across all of your devices of which you are currently logged in into</p>
//                 </div>
//             </div>
//             <form action={_formAction} className="md:col-span-2">
//                <LogoutButton/>
//             </form>
//         </div>
//     )
// }

'use client'

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { logoutOfAllSessions } from "@/app/_actions/sign-out";

const LogoutButton = () => {
    const { pending } = useFormStatus();
    return (
        <div className="mt-8 flex">
            <Button
                disabled={pending}
                className="flex items-center gap-x-2"
                variant="destructive"
                type="submit"
            >
                {pending && (<Loader2 className="w-4 h-4 animate-spin" />)}
                {pending ? "Logging out ..." : "Loging out of all Sessions"}
            </Button>
        </div>
    );
};

export const SettingsPageContent = () => {
    const [_, formAction] = useActionState(logoutOfAllSessions, null);

    return (
        <div className="divide-y divide-white/5 px-6">
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-3">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-muted">
                        Logout of all sessions
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-muted/75">
                        This will log you out of all of your sessions across all of your devices.
                    </p>
                </div>
            </div>
            <form action={formAction} className="md:col-span-2">
                <LogoutButton />
            </form>
        </div>
    );
};
