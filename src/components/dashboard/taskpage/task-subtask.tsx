"use client";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Subtask } from "@/types/dashboard/task-details-types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddSubtaskDialog } from "./add-subtask-dialog";
import SubtaskItem from "./subtask-item";

interface TaskSubtasksProps {
	subtasks: Subtask[];
	parentTaskId: number;
	parentTaskUuid: string;
}

export default function TaskSubtasks({
	subtasks: initialSubtasks,
	parentTaskId,
	parentTaskUuid,
}: TaskSubtasksProps) {
	const [isAddSubtaskOpen, setAddSubtaskOpen] = useState(false);
	console.log("Parent Task ID: ", parentTaskId);

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
				/>
			)}

			{initialSubtasks.length > 0 ? (
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
				<p className="text-center py-6 px-4 border-2 border-dashed border-border rounded-md cursor-pointer hover:border-primary transition-colors">
					No subtasks added yet.
				</p>
			)}
		</div>
	);
}
