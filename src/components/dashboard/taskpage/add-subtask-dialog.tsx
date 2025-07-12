"use client";

import { createSubtaskAction } from "@/actions/dashboard/tasks.action";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
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
import {
	type CreateSubtaskInput,
	createSubtaskSchema,
} from "@/lib/schemas/task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";

interface AddSubtaskDialogProps {
	taskId: number;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const AddSubtaskDialog = ({
	taskId,
	open,
	onOpenChange,
}: AddSubtaskDialogProps) => {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [isLoading, setLoading] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(open || false);

	useEffect(() => {
		if (open !== undefined) {
			setDialogOpen(open);
		}
	}, [open]);

	const form = useForm<CreateSubtaskInput>({
		resolver: zodResolver(createSubtaskSchema),
		defaultValues: {
			taskId,
			title: "",
			description: "",
			status: "PENDING",
			priority: "MEDIUM",
		},
	});

	const handleOpenChange = (newOpen: boolean) => {
		setDialogOpen(newOpen);
		onOpenChange?.(newOpen);
		if (!newOpen) {
			form.reset();
		}
	};

	const onSubmit = async (data: CreateSubtaskInput) => {
		setLoading(true);
		try {
			const result = await createSubtaskAction(data);
			if (result.success) {
				toast.success("Subtask created successfully!");
				form.reset();
				handleOpenChange(false);
			} else {
				toast.error(result.message || "Failed to create subtask.");
			}
		} catch (error) {
			toast.error("Failed to create subtask.");
		} finally {
			setLoading(false);
		}
	};

	const FormContent = (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Enter subtask title" />
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
								<Textarea {...field} placeholder="Enter subtask description" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="BACKLOG">Backlog</SelectItem>
									<SelectItem value="IN_PROGRESS">In Progress</SelectItem>
									<SelectItem value="IN_REVIEW">In Review</SelectItem>
									<SelectItem value="DONE">Done</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="priority"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Priority</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select priority" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="LOW">Low</SelectItem>
									<SelectItem value="MEDIUM">Medium</SelectItem>
									<SelectItem value="HIGH">High</SelectItem>
									<SelectItem value="URGENT">Urgent</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex gap-2 pt-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => handleOpenChange(false)}
						className="flex-1"
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isLoading} className="flex-1">
						{isLoading ? "Creating..." : "Create Subtask"}
					</Button>
				</div>
			</form>
		</Form>
	);

	return isMobile ? (
		<Drawer open={dialogOpen} onOpenChange={handleOpenChange}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Add Subtask</DrawerTitle>
					<DrawerDescription>
						Create a new subtask for this task
					</DrawerDescription>
				</DrawerHeader>
				<div className="px-4 pb-4">{FormContent}</div>
			</DrawerContent>
		</Drawer>
	) : (
		<Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add Subtask</DialogTitle>
					<DialogDescription>
						Create a new subtask for this task
					</DialogDescription>
				</DialogHeader>
				{FormContent}
			</DialogContent>
		</Dialog>
	);
};
