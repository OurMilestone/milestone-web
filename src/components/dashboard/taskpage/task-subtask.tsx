"use client";

import { Button } from "@/components/ui/button";
import type { Subtask } from "@/types/dashboard/task-details-types";
import type { KanbanColumnId } from "@/types/dashboard/taskboard-types";
import { PlusCircle } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import SubtaskItem from "./subtask-item";

interface TaskSubtasksProps {
	subtasks: Subtask[];
	parentTaskCode: string;
	// onAddSubtask: () => void; // For API integration
	// onUpdateSubtask: (subtaskId: string, updates: Partial<Subtask>) => Promise<void>;
	// onDeleteSubtask: (subtaskId: string) => Promise<void>;
}

export default function TaskSubtasks({
	subtasks: initialSubtasks,
	parentTaskCode,
}: TaskSubtasksProps) {
	const [subtasks, setSubtasks] = useState<Subtask[]>(initialSubtasks);

	const router = useRouter();

	// *This function is called by SubtaskItem after its internal state is updated
	// *It's mainly for the parent to be aware of completion changes,
	// *especially if it needs to re-calculate something or refresh.
	const handleSubtaskToggleComplete = async (
		subtaskId: string,
		_originalIsCompleted: boolean, // The state *before* the toggle in SubtaskItem
		_newColumnIdIfRelevant?: KanbanColumnId, // The new columnId if it changed due to completion
	) => {
		// The SubtaskItem already optimistically updated its display.
		// Here, the parent (TaskSubtasks) can react if needed.
		// For example, if the list of subtasks itself is fetched from the server
		// and needs to be refreshed to reflect the true backend state.
		console.log(
			`Parent notified: Subtask ${subtaskId} completion toggled. New status might be ${_newColumnIdIfRelevant}`,
		);

		// Todo: I could re-fetch parent task data if subtask changes affect it by refreshing the route.
		// router.refresh();
	};

	const handleToggleComplete = async (
		subtaskId: string,
		isCompleted: boolean,
	) => {
		// TODO: Simulate API call
		console.log(
			`Toggling subtask ${subtaskId} to ${isCompleted ? "complete" : "incomplete"}`,
		);

		setSubtasks((prev) =>
			prev.map((st) =>
				st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st,
			),
		);

		// await onUpdateSubtask(subtaskId, { isCompleted: !currentStatus });
	};

	return (
		<div className="space-y-3 py-3">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-medium text-primary">Subtasks</h3>
			</div>
			{/* //* I could use initialSubtasks if subtask state is primarily managed by parent page re-fetch */}
			{/* //* Or use local 'subtasks' state if TaskSubtasks manages its own list after load. I'll will figure out which step option to use when integrating the API */}
			{(initialSubtasks || subtasks).length > 0 ? (
				<ul className="space-y-2">
					{(initialSubtasks || subtasks).map(
						(
							st, // Decide which state to map over
						) => (
							<SubtaskItem
								key={st.id}
								subtask={st}
								onToggleComplete={handleSubtaskToggleComplete}
							/>
						),
					)}
				</ul>
			) : (
				<p className="text-sm text-muted-foreground text-center py-4">
					No subtasks added yet.
				</p>
			)}
		</div>
	);
}
