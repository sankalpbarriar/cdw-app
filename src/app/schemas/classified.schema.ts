import { z } from "zod";

export const ClassifiedFilterSchema = z.object({
	q: z.string().optional(),
	make: z.string().optional(),
	model: z.string().optional(),
	modelVariant: z.string().optional(),
	minYear: z.string().optional(),
	maxYear: z.string().optional(),
	minPrice: z.string().optional(),
	maxPrice: z.string().optional(),
	minReading: z.string().optional(),
	maxReading: z.string().optional(),
	currency: z.string().optional(),
	odoUnit: z.string().optional(),
	transmission: z.string().optional(),
	fuelType: z.string().optional(),
	bodyType: z.string().optional(),
	colour: z.string().optional(),
	doors: z.string().optional(),
	seats: z.string().optional(),
	ulezCompliance: z.string().optional(),
});