"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Subtask } from "@/types/dashboard/task-details-types";
import { AlertTriangle, Plus } from "lucide-react";
import { useState } from "react";
import { AddSubtaskDialog } from "./add-subtask-dialog";
import SubtaskItem from "./subtask-item";

import TaskSubtaskSkeleton from "./skeletons/task-subtask-skeleton";

interface TaskSubtasksProps {
	subtasks: Subtask[];
	parentTaskId: number;
	parentTaskUuid: string;
	isLoading: boolean;
	error: Error | null;
	refetch: () => void;
}

export default function TaskSubtasks({
	subtasks: initialSubtasks,
	parentTaskId,
	parentTaskUuid,
	isLoading,
	error,
	refetch,
}: TaskSubtasksProps) {
	const [isAddSubtaskOpen, setAddSubtaskOpen] = useState(false);

	return (
		<div className="space-y-3 py-3">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-medium text-primary">Subtasks</h3>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="icon"
								variant="outline"
								onClick={() => setAddSubtaskOpen(true)}
							>
								<Plus />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Add Subtask</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{isAddSubtaskOpen && (
				<AddSubtaskDialog
					taskId={parentTaskId}
					open={isAddSubtaskOpen}
					onOpenChange={setAddSubtaskOpen}
					parentTaskUuid={parentTaskUuid}
				/>
			)}

			{isLoading ? (
				<TaskSubtaskSkeleton />
			) : error ? (
				<Alert variant="destructive">
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						Failed to load subtasks. Please try again.
						<Button onClick={() => refetch()} variant="link">
							Retry
						</Button>
					</AlertDescription>
				</Alert>
			) : initialSubtasks.length > 0 ? (
				<ul className="space-y-2">
					{initialSubtasks.map((st) => (
						<SubtaskItem
							key={st.id}
							subtask={st}
							parentTaskId={parentTaskId}
							parentTaskUuid={parentTaskUuid}
						/>
					))}
				</ul>
			) : (
				<p className="text-center py-6 px-4 border-2 border-dashed border-border rounded-md hover:border-primary transition-colors">
					No subtasks added yet.
				</p>
			)}
		</div>
	);
}
