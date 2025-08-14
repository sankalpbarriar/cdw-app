'use client'
import { useFormStatus } from "react-dom"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { signOutAction } from "@/app/_actions/sign-out"

export const SignOutForm = () => {
    return <form action={signOutAction}>
        <SignOutButton />
    </form>
}

const SignOutButton = () => {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 bg-blue-500 text-black"
        >
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spi" />}
            SignOut
        </Button>
    )
}