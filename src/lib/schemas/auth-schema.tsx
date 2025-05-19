import { z } from "zod";

export const registerFormSchema = z
	.object({
		legalName: z
			.string()
			.min(2, { message: "Legal name must be at least 2 characters" }),
		preferredName: z.string().min(1, { message: "Preferred name is required" }),
		email: z.string().email({ message: "Please enter a valid email address" }),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" })
			.regex(/[0-9]/, { message: "Password must contain at least one number" })
			.regex(/[!@#$%^&*]/, {
				message: "Password must contain at least one special character",
			}),
		confirmPassword: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" })
			.regex(/[0-9]/, { message: "Password must contain at least one number" })
			.regex(/[!@#$%^&*]/, {
				message: "Password must contain at least one special character",
			}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const loginFormSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
	password: z.string().min(1, { message: "Password is required" }),
});
