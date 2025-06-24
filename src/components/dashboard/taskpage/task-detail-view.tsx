"use client";

import { Button } from "@/components/ui/button";
import type { useUpdateTaskField } from "@/hooks/mutations/use-update-task";
import type { TaskDetail } from "@/types/dashboard/task-details-types";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import TaskDescription from "./task-description";
import TaskSubtasks from "./task-subtask";

interface TaskDetailViewProps {
	task: TaskDetail;
	updateTaskField: ReturnType<typeof useUpdateTaskField>["mutate"];
	isUpdatingTask: boolean;
}

export default function TaskDetailView({
	task,
	updateTaskField,
	isUpdatingTask,
}: TaskDetailViewProps) {
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [title, setTitle] = useState(task.title);
	const [parent] = useAutoAnimate<HTMLDivElement>();

	useEffect(() => {
		setTitle(task.title);
	}, [task.title]);

	const handleTitleSave = () => {
		if (title.trim() === "" || title === task.title) {
			setIsEditingTitle(false);
			return;
		}
		updateTaskField({
			taskId: task.id,
			fields: { title },
		});
		setIsEditingTitle(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleTitleSave();
		} else if (e.key === "Escape") {
			setTitle(task.title);
			setIsEditingTitle(false);
		}
	};

	return (
		<div className="space-y-4 mt-18">
			<div
				className="flex flex-col justify-between  gap-2 items-start pt-2"
				ref={parent}
			>
				<div className="w-full p-4 rounded-sm bg-background">
					{!isEditingTitle ? (
						<p
							className="text-foreground flex-1 truncate pr-4 cursor-text"
							onClick={() => setIsEditingTitle(true)}
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									setIsEditingTitle(true);
								}
							}}
							// biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: <explanation>
							// biome-ignore lint/a11y/useSemanticElements: <explanation>
							role="button"
							aria-label="Edit task title"
							title="Click to edit task title"
						>
							{title}
						</p>
					) : (
						<input
							type="text"
							className="w-full p-2 border-none rounded-md"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							onBlur={handleTitleSave}
							onKeyDown={handleKeyDown}
							// biome-ignore lint/a11y/noAutofocus: <explanation>
							autoFocus
							aria-label="Task title input"
						/>
					)}
				</div>
				{!task.description && (
					<Button
						variant="outline"
						size="sm"
						className="flex-shrink-0 rounded-sm bg-white"
					>
						<Plus className="mr-2 h-4 w-4" /> Add
					</Button>
				)}
			</div>
			<TaskDescription
				initialDescription={task.description}
				taskId={task.id}
				updateTaskField={updateTaskField}
				isUpdatingTask={isUpdatingTask}
			/>
			<TaskSubtasks subtasks={task.subtasks || []} parentTaskCode={task.code} />
			{/* //* Activity section was here for now. Maybe implemeted after MVP */}
		</div>
	);
}
