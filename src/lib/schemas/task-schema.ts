import { z } from "zod";

export const createTaskSchema = z.object({
	projectId: z.number({ required_error: "Project ID is missing." }),

	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters long." }),

	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters long." }),

	label: z.enum(["FEATURE", "BUG", "DOCUMENTATION", "OTHER"], {
		errorMap: () => ({ message: "Please select a valid label." }),
	}),

	priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
		errorMap: () => ({ message: "Please select a valid priority." }),
	}),

	status: z.enum(
		["BACKLOG", "IN_PROGRESS", "IN_REVIEW", "DONE", "PENDING", "CANCELLED"],
		{
			errorMap: () => ({ message: "Please select a valid status." }),
		},
	),

	assignee: z.string().uuid({ message: "Please select a valid assignee." }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
