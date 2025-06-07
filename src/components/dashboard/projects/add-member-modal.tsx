"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, UserPlus } from "lucide-react";

import {
	addProjectMember,
	type AddMemberData,
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
import { toast } from "sonner";
import { useProjects } from "@/components/providers/project-provider";

const formSchema = z.object({
	user_email: z.string().email("Please enter a valid email address"),
	role: z.enum(["admin", "member"], {
		required_error: "Please select a role",
	}),
});

type FormValues = z.infer<typeof formSchema>;

interface AddMemberModalProps {
	projectId: string;
	projectTitle?: string;
}

export function AddMemberModal({
	projectId,
	projectTitle,
}: AddMemberModalProps) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { refetchProjectMembers } = useProjects();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			user_email: "",
			role: "member",
		},
	});

	function onSubmit(values: FormValues) {
		startTransition(async () => {
			try {
				const result = await addProjectMember(
					projectId,
					values as AddMemberData,
				);

				if (result.success) {
					toast("Member added", {
						description: result.message,
					});

					await refetchProjectMembers(projectId);

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
				console.error("Error adding member:", error);
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<UserPlus className="h-4 w-4" />
					Add Member
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Team Member</DialogTitle>
					<DialogDescription>
						Add a new member to {projectTitle || "this project"}. They will
						receive an invitation via email.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="user_email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter member's email"
											type="email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a role" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="member">Member</SelectItem>
											<SelectItem value="admin">Admin</SelectItem>
										</SelectContent>
									</Select>
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
								Add Member
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
