'use client'

import { OneTimePasswordSchema, OtpSchemaType } from "@/app/schemas/otp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { OneTimePasswordInput } from "./otp-input";
import { Loader2, RotateCw } from "lucide-react";
import { completeChallengeAction, resendChallengeAction } from "@/app/_actions/challenge";
import { toast } from "sonner";

export const OtpForm = () => {
    const [isCodePending, startCodeTransition] = useTransition();
    const [isSubmitPending, startSubmitTransition] = useTransition();

    const router = useRouter();
    const form = useForm<OtpSchemaType>({
        resolver: zodResolver(OneTimePasswordSchema),
    })

    const onSubmit: SubmitHandler<OtpSchemaType> = (data) => {
        startSubmitTransition(async () => {
            const result = await completeChallengeAction(data.code);

            console.log("first :", { result })
            if (!result.success) {
                toast(
                    <div>
                        <strong className="text-red-600">Error</strong>
                        <p className="text-black">{result.message}</p>
                    </div>
                );
            }
            else{
                console.log("second: ",{result})
            }
        })
    }

    const [sendButtonText, setSendButtonText] = useState("send Code")

    const sendCode = () => {
        startCodeTransition(async () => {
            const { success, message } = await resendChallengeAction();
            setSendButtonText("Resend code")

            if (!success) {
                toast(
                    <div>
                        <strong className="text-red-600">Error</strong>
                        <p className="text-black">{message}</p>
                    </div>
                );
                return;
            }

            toast(
                <div>
                    <strong className="text-green-600">Code sent</strong>
                    <p className="text-black">check your email for the code</p>
                </div>
            );
            return;
        })
    }

    useEffect(() => {
        if (isCodePending) setSendButtonText("sending ...")
    }, [isCodePending])

    return (
        <div className="min-h-[calc(100vh-4rem)] flex w-full flex-1 justify-center px-6 pt-10 lg:item-center lg:pt-0">
            <div className="flex w-full max-w-lg flex-col">
                <h3 className="mb-4 text-black text-4xl lg:text-5xl text-center">
                    One Time Password
                </h3>
                <p className="mb-12 text-center text-slate-500">Enter the 6 digit code sent to your Email</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field: { value, onChange, ...rest } }) => (
                                <FormItem className="text-black mb-8">
                                    <FormControl>
                                        <OneTimePasswordInput type="text" setValue={onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex w-full items-center justify-center">
                            <button type="button" className="flex items-center gap-2.5 text-base font-medium text-slate-600 transition-colors duration-200 hover:text-primary-group cursor-pointer"
                                onClick={sendCode}
                                disabled={isCodePending}
                            >
                                {isCodePending ? (<Loader2 className="w-6 h-6 text-secondary transition-colors duration-200 group-hover:text-primary animate-spin" />) : (<RotateCw className="w-6 h-6 text-secondary transition-colors duration-200 group-hover:text-primary" />)}
                                {sendButtonText}
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}