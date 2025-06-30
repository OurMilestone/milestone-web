"use client";

import type { UpdateProjectInput } from "@/lib/schemas/project-schema";
import { updateProjectSchema } from "@/lib/schemas/project-schema";
import type { ProjectStatus } from "@/types/dashboard/projects-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";
import { EditProjectForm } from "../dashboard/projects/edit-project-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "../ui/drawer";
import { Form } from "../ui/form";

interface EditProjectModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	project: {
		id: number;
		title: string;
		description: string;
		duration: number;
		duration_type: string;
		budget: number;
		status: ProjectStatus;
	};
	onSubmit: (values: UpdateProjectInput) => void;
	isSubmitting: boolean;
}

export function EditProjectModal({
	isOpen,
	setIsOpen,
	project,
	onSubmit,
	isSubmitting,
}: EditProjectModalProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const form = useForm<UpdateProjectInput>({
		resolver: zodResolver(updateProjectSchema),
		defaultValues: {
			title: project.title,
			description: project.description,
			duration: project.duration,
			duration_type: project.duration_type,
			budget: project.budget,
			status: project.status ?? "pending",
		},
	});

	const renderForm = () => (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="p-4 md:p-0 space-y-4"
			>
				<EditProjectForm form={form} isSubmitting={isSubmitting} />
			</form>
		</Form>
	);

	if (isDesktop) {
		return (
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Project: {project.title}</DialogTitle>
						<DialogDescription>
							Make changes to your project details below.
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
				<DrawerHeader>
					<DrawerTitle>Edit Project: {project.title}</DrawerTitle>
					<DrawerDescription>
						Make changes to your project details below.
					</DrawerDescription>
				</DrawerHeader>
				{renderForm()}
			</DrawerContent>
		</Drawer>
	);
}
