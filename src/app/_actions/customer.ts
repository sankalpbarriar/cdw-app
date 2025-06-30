"use server";
import { routes } from "@/config/routes";
import {
  CreateCustomerSchema,
  CreateCustomerType,
  UpdateCustomerSchema,
} from "../schemas/customer.schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CustomerStatus } from "@prisma/client";

//server action to store the customer data in database
export const createCustomerAction = async (props: CreateCustomerType) => {
	try {
		const { data, success, error } = CreateCustomerSchema.safeParse(props);

		if (!success) {
			console.log({ error });
			return { success: false, message: "Invalid data" };
		}

		if (data.terms !== "true") {
			return { success: false, message: "You must accept the terms" };
		}

		const { date, terms, slug, ...rest } = data;

		await prisma.customer.create({
			data: {
				...rest,
				bookingDate: date,
				termsAccepted: terms === "true",
				classified: { connect: { slug } },
			},
		});

		return { success: true, message: "Reservation Successful!" };
	} catch (error) {
		console.log({ error });
		if (error instanceof Error) {
			return { success: false, message: error.message };
		}

		return { success: false, message: "Something went wrong" };
	}
};

export const deleteCustomerAction = async (id:number) => {
  try{
	await prisma.customer.delete({
	  where:{id}
	})
	revalidatePath(routes.admin.customers);
	return {success:true,message:"customer deleted"}
  }catch(error){
	console.log("Error deleting customer",{error});
	return {success:false,message:"Something went wrong deleting customer"}
  }
}

export const updateCustomerAction = async (props: {
	id: number;
	status: CustomerStatus;
}) => {
	try {
		const validProps = UpdateCustomerSchema.safeParse(props);

		if (!validProps.success) return { success: false, message: "Invalid data" };

		const customer = await prisma.customer.findUnique({
			where: { id: validProps.data?.id },
		});

		console.log({ customer });
		if (!customer) return { success: false, message: "Customer not found" };

		console.log({
			oldStatus: customer.status,
			newStatus: validProps.data.status,
		});
		await prisma.customer.update({
			where: { id: customer.id },
			data: {
				status: validProps.data.status,
				lifecycle: {
					create: {
						oldStatus: customer.status,
						newStatus: validProps.data.status,
					},
				},
			},
		});

		revalidatePath(routes.admin.editCustomer(customer.id));
		revalidatePath(routes.admin.customers);

		return { success: true, message: "Customer updated" };
	} catch (error) {
		console.log("Error in customer update action: ", { error });
		if (error instanceof Error) {
			return { success: false, message: error.message };
		}
		return { success: false, message: "Something went wrong" };
	}
};
