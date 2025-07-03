"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	type CreateProjectData,
	createProject,
} from "@/actions/dashboard/projects.actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	duration: z.coerce.number().positive("Duration must be a positive number"),
	duration_type: z.enum(["days", "weeks", "months", "years"], {
		errorMap: () => ({ message: "Please select a valid duration type" }),
	}),
	budget: z.coerce.number().positive("Budget must be a positive number"),
	status: z.string().min(1, "Status is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateProjectModal() {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	// Initialize form with default values
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			duration: 1,
			duration_type: "months",
			budget: 0,
			status: "pending",
		},
	});

	// Handle form submission
	function onSubmit(values: FormValues) {
		console.log("Form submitted with values:", values);
		startTransition(async () => {
			try {
				const result = await createProject(values as CreateProjectData);

				if (result.success) {
					toast("Project created", {
						description: result.message,
					});
					setOpen(false);
					form.reset();
				} else {
					toast("Error", {
						description: result.message,
					});
				}
			} catch (error) {
				toast("Error", {
					description: "An unexpected error occurred. Please try again.",
				});
				console.error("Error creating project:", error);
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Create Project</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>Create New Project</DialogTitle>
					<DialogDescription>
						Fill in the details to create a new project. Click save when you're
						done.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Project Title</FormLabel>
									<FormControl>
										<Input placeholder="Enter project title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe your project"
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="duration"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Duration</FormLabel>
										<FormControl>
											<Input type="number" min="1" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="duration_type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Duration Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select duration type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="days">Days</SelectItem>
												<SelectItem value="weeks">Weeks</SelectItem>
												<SelectItem value="months">Months</SelectItem>
												<SelectItem value="years">Years</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="budget"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Budget ($)</FormLabel>
									<FormControl>
										<Input type="number" min="0" step="100" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Create Project
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
