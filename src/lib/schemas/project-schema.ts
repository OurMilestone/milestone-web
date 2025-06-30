import { z } from "zod";

export const projectStatusSchema = z.enum([
	"pending",
	"in_progress",
	"completed",
	"cancelled",
]);

export const updateProjectSchema = z.object({
	title: z.string().min(3, { message: "Title must be at least 3 characters." }),
	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters." }),
	duration: z.coerce
		.number()
		.positive({ message: "Duration must be positive." }),
	duration_type: z.string().min(1, { message: "Duration type is required." }),
	budget: z.coerce.number().positive({ message: "Budget must be positive." }),
	status: projectStatusSchema,
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
