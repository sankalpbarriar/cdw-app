import { auth } from "@/auth"

export default async function ChallengePage() {
    const session = await auth()

    console.log({session})
    return <>Challeneg</>
}