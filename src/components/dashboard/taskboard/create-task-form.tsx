"use client";

import RichTextEditor from "@/components/tiptap/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
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
import type { ProjectMemberDTO } from "@/lib/data-access-layer/DTOs/project.dto";
import type { CreateTaskInput } from "@/lib/schemas/task-schema";
import type { KanbanColumnId } from "@/types/dashboard/taskboard-types";
import type { UseFormReturn } from "react-hook-form";

interface CreateTaskFormProps {
	form: UseFormReturn<CreateTaskInput>;
	assignees: ProjectMemberDTO[];
	initialStatus?: KanbanColumnId;
	onSubmit: (values: CreateTaskInput) => void;
}

export function CreateTaskForm({
	form,
	assignees,
	initialStatus,
	onSubmit,
}: CreateTaskFormProps) {
	return (
		<div
			className="overflow-y-auto custom-scrollbar max-h-[70vh] md:max-h-[80vh] space-y-4 px-2 pb-20 md:pb-4"
			style={{ WebkitOverflowScrolling: "touch" }}
		>
			<FormField
				control={form.control}
				name="title"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Title</FormLabel>
						<FormControl>
							<Input
								placeholder="e.g., Implement user authentication"
								{...field}
							/>
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
							<RichTextEditor
								content={field.value ?? ""}
								onChange={field.onChange}
								placeholder="Provide a detailed description of the task..."
								editable={true}
								extraStyles="h-[150px] resize-none"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="assignee"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Assignee</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl className="w-full">
								<SelectTrigger>
									<SelectValue placeholder="Select an assignee" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="unassigned">Leave Unassigned</SelectItem>
								{assignees.map((user) => (
									<SelectItem key={user.id} value={user.id}>
										{user.full_name ?? user.preferred_name}
									</SelectItem>
								))}
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
							<FormControl className="w-full">
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

			<FormField
				control={form.control}
				name="label"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Label</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl className="w-full">
								<SelectTrigger>
									<SelectValue placeholder="Select a label" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="FEATURE">Feature</SelectItem>
								<SelectItem value="BUG">Bug</SelectItem>
								<SelectItem value="DOCUMENTATION">Documentation</SelectItem>
								<SelectItem value="OTHER">Other</SelectItem>
							</SelectContent>
						</Select>
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
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
							disabled={!!initialStatus}
						>
							<FormControl className="w-full">
								<SelectTrigger>
									<SelectValue placeholder="Select a status" />
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

			<Button
				type="button"
				className="w-full mt-4 h-12"
				disabled={form.formState.isSubmitting}
				onClick={form.handleSubmit(onSubmit)}
			>
				{form.formState.isSubmitting ? "Creating..." : "Create Task"}
			</Button>
		</div>
	);
}
