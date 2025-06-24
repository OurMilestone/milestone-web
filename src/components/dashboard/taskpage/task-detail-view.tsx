"use client";

import { Button } from "@/components/ui/button";
import type { useUpdateTaskField } from "@/hooks/mutations/use-update-task";
import type { TaskDetail } from "@/types/dashboard/task-details-types";
import { Plus } from "lucide-react";
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
	return (
		<div className="space-y-4 mt-18">
			<div className="flex flex-col justify-between  gap-2 items-start pt-2">
				<div className="w-full p-4 rounded-sm bg-background">
					<p className="text-foreground flex-1 truncate pr-4">{task.title}</p>
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
