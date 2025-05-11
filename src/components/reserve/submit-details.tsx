"use client";

import { createCustomerAction } from "@/app/_actions/customer";
import {
    SubmitDetailsSchema,
    type SubmitDetailsSchemaType,
} from "@/app/schemas/customer.schema";
import { routes } from "@/config/routes";
import {
    type MultiStepFormComponentProps,
    MultiStepFormEnum,
} from "@/config/types";
import { formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "sonner";

export const SubmitDetails = (props: MultiStepFormComponentProps) => {
    const { params, searchParams } = props;
    const router = useRouter();
    const form = useForm<SubmitDetailsSchemaType>({
		resolver: zodResolver(SubmitDetailsSchema),
		mode: "onBlur",
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			mobile: "",
			terms: "false",
		},
	});

    const [isPending, startTransition] = useTransition();
    const [isPrevPending, startPrevTransition] = useTransition();

    const prevStep = () => {
        startPrevTransition(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const url = new URL(window.location.href);
            url.searchParams.set("step", MultiStepFormEnum.SELECT_DATE.toString());
            router.push(url.toString());
        });
    };

    const onSubmitDetails: SubmitHandler<SubmitDetailsSchemaType> = (data) => {
        startTransition(async () => {
            const valid = await form.trigger();
            if (!valid) return;
            await new Promise((resolve) => setTimeout(resolve, 500));

            const handoverDate = decodeURIComponent(
                searchParams?.handoverDate as string,
            );

            const handoverTime = decodeURIComponent(
                searchParams?.handoverTime as string,
            );

            console.log({handoverDate,handoverTime})

            const date = formatDate(handoverDate, handoverTime);

            console.log({date});

            const { success, message } = await createCustomerAction({
                slug: params?.slug as string,
                date,
                ...data,
            });

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
                  <strong className="text-green-400">Success</strong>
                  <p className="text-black">{message}</p>
                </div>
              );

            setTimeout(() => {
                router.push(routes.success(params?.slug as string));
            }, 1000);
        });
    };

    return (
        <Form {...form}>
            <form
                className="mx-auto bg-white flex flex-col rounded-b-lg shadow-lg p-6 h-96"
                onSubmit={form.handleSubmit(onSubmitDetails)}
            >
                <div className="space-y-6 flex-1">
                    <div className="grid grid-cols-2 gap-6 text-black">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel htmlFor="firstName">Enter First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="lastName">Enter Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email">Enter Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="mobile">Enter Mobile</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your mobile number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-center space-x-2 text-black">
                        <FormField
                            control={form.control}
                            name="terms"
                            render={({ field: { ref, onChange, ...rest } }) => (
                                <FormItem className="flex items-center gap-x-2">
                                    <FormControl>
                                        <Checkbox
                                            className="cursor-pointer m-0"
                                            onCheckedChange={(e) => onChange(e ? "true" : "false")}
                                            {...rest}
                                        />
                                    </FormControl>
                                    <FormLabel
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        I agree to the terms and conditions
                                    </FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="flex gap-x-4">
                    <Button
                        type="button"
                        onClick={prevStep}
                        disabled={isPrevPending}
                        className="uppercase font-bold flex gap-x-3 w-full flex-1"
                    >
                        {isPrevPending ? (
                            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                        ) : null}{" "}
                        Previous Step
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="uppercase font-bold flex gap-x-3 w-full flex-1"
                    >
                        {isPending ? (
                            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                        ) : null}{" "}
                        Submit Details
                    </Button>
                </div>
            </form>
        </Form>
    );
};