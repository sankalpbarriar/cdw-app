'use client'

import { MultiStepFormComponentProps, MultiStepFormEnum } from "@/config/types"
import { ArrowRight, CircleCheckIcon, CreditCardIcon, Loader2, LockIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { HTMLParser } from "../shared/html-parser"
import { Button } from "../ui/button"


export const Welcome = (props: MultiStepFormComponentProps) => {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();
    const nextStep = () => {
        startTransition(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));  //delay the fxn from executing
            const url = new URL(window.location.href);
            url.searchParams.set("step", MultiStepFormEnum.SELECT_DATE.toString());
            router.push(url.toString())
        })
    }

    return (
        <div className="mx-auto bg-white rounded-b-lg shadow-lg">
            <div className="lg:p-6 p-4 sm:p-6">
                <div className="flex gap-x-8 lg:gap-x-12 justify-between">
                    <div className="flex-1">
                        <div className="flex items-start mb-4">
                            <CircleCheckIcon className="text-green-500 w-6 h-6 mr-2" />
                            <p className="text-gray-700">Reserve in minutes in 2 simple steps</p>
                        </div>
                        <div className="flex items-start mb-4">
                            <CircleCheckIcon className="text-green-500 w-6 h-6 mr-2" />
                            <p className="text-gray-700">Arrange handover date for your new vehicle </p>
                        </div>
                    </div>
                    <div className="flex flex-1 space-x-2">
                        <div className="relative w-16 h-16">
                            <Image
                                src={props.classified.make.image}
                                alt={props.classified.make.name}
                                className="aspect-1/1 object-contain"
                                height={100}
                                width={100}
                            />
                        </div>
                        <div className="flex-1 text-black">
                            <h2 className="text-lg font-semibold line-clamp-1">{props.classified.title}</h2>
                            <div className="text-xs line-clamp-2">
                                <HTMLParser html={props.classified.description ?? " "} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-around items-center bg-gray-100 p-4 rounded-md mb-4">
                    <div className="text-center">
                        <p className="font-bold text-black">Select Handover Date & Time</p>
                        <p className="text-gray-500">approx 1 minute </p>
                    </div>
                    <ArrowRight className="w-6 h-5 text-black" />
                    <div className="text-center">
                        <p className="font-bold text-black">Select Your Details</p>
                        <p className="text-gray-500">approx 1 minute </p>
                    </div>
                </div>
                <p className="font-bold mb-4  text-black"> Ready to Begin?</p>
                <div className="flex justify-around items-center text-black">
                    <div className="flex items-center flex-col justify-center space-y-2">
                        <LockIcon className="w-6 h-6" />
                        <p className="text-gray-700">SSL secure</p>
                    </div>
                    <div className="flex items-center flex-col justify-center space-y-2">
                        <StarIcon className="w-6 h-6" />
                        <p className="text-gray-700">Trustpilot</p>
                    </div>
                    <div className="flex items-center flex-col justify-center space-y-2">
                        <CreditCardIcon className="w-6 h-6" />
                        <p className="text-gray-700">Stripe</p>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <Button
                className="uppercase font-bold  gap-x-3 w-full"
                type="button"
                onClick={nextStep}
                disabled={isPending}
                >
                {isPending ? <Loader2 className="w-4 h-4 shrink-0"/> : null}
                {""} I'm Ready
                </Button>
            </div>
        </div>
    );
}