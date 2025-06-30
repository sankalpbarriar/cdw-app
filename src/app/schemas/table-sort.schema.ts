import { z } from "zod";

export const CustomersTableSortSchema = z.object({
	order: z.enum(["asc", "desc"]).default("desc"),
	sort: z
		.enum([
			"id",
			"email",
			"mobile",
			"firstName",
			"lastName",
			"updatedAt",
			"createdAt",
			"status",
			"bookingDate",
			"classified",
		])
		.default("createdAt"),
});

export type CustomersTableSortType = z.infer<typeof CustomersTableSortSchema>;

export const ClassifiedsTableSortSchema = z.object({
	order: z.enum(["asc", "desc"]).default("desc"),
	sort: z
		.enum([
			"status",
			"title",
			"vrm",
			"id",
			"views",
			"year",
			"colour",
			"price",
			"created_at",
		])
		.default("created_at"),
});

export type ClassifiedsTableSortType = z.infer<
	typeof ClassifiedsTableSortSchema
>;

interface ValidateSortOrderArgs<TSchemaType> {
	sort: string;
	order: string;
	schema: TSchemaType extends ClassifiedsTableSortType
		? typeof ClassifiedsTableSortSchema
		: typeof CustomersTableSortSchema;
}

export function validateSortOrder<TSchemaType>(
	args: ValidateSortOrderArgs<TSchemaType>,
) {
	const { sort, order, schema } = args;
	const { data, success, error } = schema.safeParse({
		sort,
		order,
	});

	if (error) console.log("Validation error: ", error);

	if (!success) {
		return {
			sort: undefined,
			order: undefined,
		};
	}

	return data;
}