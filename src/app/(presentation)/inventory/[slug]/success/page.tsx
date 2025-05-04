import { EndButtons } from "@/components/shared/end-buttons";
import { CircleCheck } from "lucide-react";

export default function SuccessfulReservationPage(){
    return (
        <div className="flex min-h-[80dvh] flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <CircleCheck className="mx-auto w-16 h-16 text-green-500"/>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl ">Reservation Confirmed !</h1>
                <p className="mt-4 text-muted-foreground">Thank you for your reservaion . We'll see you soon                    
                </p>
                <EndButtons/>
            </div>
        </div>
    )
}