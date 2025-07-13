"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { addProjectMemberAction } from "@/actions/dashboard/projects.actions";

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
import { queryKeys } from "@/lib/query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const addMemberSchema = z.object({
	user_email: z.string().email("Please enter a valid email address"),
	role: z.enum(["admin", "member"], {
		required_error: "Please select a role",
	}),
});

type FormValues = z.infer<typeof addMemberSchema>;

interface AddMemberModalProps {
	projectId: string;
	projectTitle?: string;
}

export function AddMemberModal({
	projectId,
	projectTitle,
}: AddMemberModalProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const form = useForm<FormValues>({
		resolver: zodResolver(addMemberSchema),
		defaultValues: {
			user_email: "",
			role: "member",
		},
	});

	const { mutate: addMember, isPending } = useMutation({
		mutationFn: (values: FormValues) =>
			addProjectMemberAction(Number(projectId), values),

		onSuccess: (res) => {
			if (res.success) {
				toast.success("Member Added", {
					description: <span className="text-foreground">{res.message}</span>,
				});

				queryClient.invalidateQueries({
					queryKey: queryKeys.projects.activeWithMembers,
				});

				queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });

				setOpen(false);

				form.reset();
			} else {
				toast.error("Failed to Add Member", {
					description: <span className="text-foreground">{res.message}</span>,
				});
			}
		},
		onError: (err) => {
			toast.error("An Error Occurred", {
				description: <span className="text-foreground">{err.message}</span>,
			});
		},
	});

	function onSubmit(values: FormValues) {
		addMember(values);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="gap-2 bg-white shadow-none"
					onClick={(e) => e.stopPropagation()}
				>
					<UserPlus className="h-4 w-4" />
					Add Member
				</Button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-[425px]"
				onInteractOutside={(e) => e.stopPropagation()}
			>
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
