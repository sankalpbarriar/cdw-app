"use client";
import { updateCustomerAction } from "@/app/_actions/customer";
import {
	EditCustomerSchema,
	type EditCustomerType,
} from "@/app/schemas/customer.schema";
import { formatCustomerStatus } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Customer, CustomerStatus } from "@prisma/client";
import { useTransition } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Select } from "../ui/select";
import { toast } from "sonner";

export const EditCustomerForm = ({ customer }: { customer: Customer }) => {
	const form = useForm<EditCustomerType>({
		resolver: zodResolver(EditCustomerSchema),
		defaultValues: {
			status: customer.status,
		},
	});

	const [, startTransition] = useTransition();

	const onChangeHandler: SubmitHandler<EditCustomerType> = (data) => {
		startTransition(async () => {
			const result = await updateCustomerAction({
				id: customer.id,
				status: data.status,
			});

			if (result.success) {
				toast(
                    <div>
                        <strong className="text-green-600">Customer Updated</strong>
                        <p className="text-white">{result.message}</p>
                    </div>
                );
			} else {
				toast(
                    <div>
                        <strong className="text-red-600">Error Updating Customer</strong>
                        <p className="text-white">{result.message}</p>
                    </div>
                );
			}
		});
	};

	return (
		<Form {...form}>
			<form onChange={form.handleSubmit(onChangeHandler)}>
				<FormField
					control={form.control}
					name="status"
					render={({ field: { ref, ...rest } }) => (
						<FormItem>
							<FormLabel htmlFor="status">Customer Status</FormLabel>
							<FormControl>
								<Select
									options={Object.values(CustomerStatus).map((value) => ({
										label: formatCustomerStatus(value),
										value,
									}))}
									noDefault={false}
									selectClassName="bg-primary-800 border-transparent text-gray-500"
									{...rest}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};