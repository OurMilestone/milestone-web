"use client";

import { createTaskAction } from "@/actions/dashboard/tasks.action";
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
import { Form } from "@/components/ui/form";
import type { ProjectMemberDTO } from "@/lib/data-access-layer/DTOs/project.dto";
import {
	type CreateTaskInput,
	createTaskSchema,
} from "@/lib/schemas/task-schema";
import type { KanbanColumnId } from "@/types/dashboard/taskboard-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { CreateTaskForm } from "../dashboard/taskboard/create-task-form";

interface CreateTaskModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	projectId: number;
	assignees: ProjectMemberDTO[];
	onSuccess: () => void;
	initialStatus?: KanbanColumnId;
}

export function CreateTaskModal({
	isOpen,
	setIsOpen,
	projectId,
	assignees,
	onSuccess,
	initialStatus,
}: CreateTaskModalProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const handleSuccess = () => {
		onSuccess();
		setIsOpen(false);
	};

	const form = useForm<CreateTaskInput>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			projectId,
			title: "",
			description: "",
			status:
				(initialStatus?.toUpperCase() as
					| "BACKLOG"
					| "IN_PROGRESS"
					| "IN_REVIEW"
					| "DONE"
					| "PENDING"
					| "CANCELLED") ?? "BACKLOG",
			label: undefined,
			priority: undefined,
			assignee: undefined,
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		form.reset({
			projectId,
			title: "",
			description: "",
			status:
				(initialStatus?.toUpperCase() as
					| "BACKLOG"
					| "IN_PROGRESS"
					| "IN_REVIEW"
					| "DONE"
					| "PENDING"
					| "CANCELLED") ?? "BACKLOG",
		});
	}, [isOpen, initialStatus, form, projectId]);

	const onSubmit = async (values: CreateTaskInput) => {
		console.log("Submitting task creation with values:", values);
		toast.promise(createTaskAction(values), {
			loading: "Creating task...",
			success: (res) => {
				if (res.success) {
					onSuccess();
					setIsOpen(false);
					form.reset();
					return res.message;
				}
				throw new Error(res.message);
			},
			error: (err) => err.message || "An unexpected error occurred.",
		});
	};

	const renderForm = () => (
		<Form {...form}>
			<form className="p-4 md:p-0">
				<CreateTaskForm
					form={form}
					assignees={assignees}
					initialStatus={initialStatus}
					onSubmit={onSubmit}
				/>
			</form>
		</Form>
	);

	if (isDesktop) {
		return (
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="sm:max-w-[625px]">
					<DialogHeader>
						<DialogTitle>Create New Task</DialogTitle>
						<DialogDescription>
							Fill in the details below to add a new task to the project.
						</DialogDescription>
					</DialogHeader>
					{renderForm()}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen}>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Create New Task</DrawerTitle>
					<DrawerDescription>
						Fill in the details below to add a new task to the project.
					</DrawerDescription>
				</DrawerHeader>
				<div className="p-4">{renderForm()}</div>
			</DrawerContent>
		</Drawer>
	);
}
