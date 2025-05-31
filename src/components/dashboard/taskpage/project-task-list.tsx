"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserRole } from "@/types/auth/auth-types";
import type { ProjectTaskListItem } from "@/types/dashboard/task-details-types";
import TaskItemCard from "./task-item-card";

interface ProjectTaskListProps {
	tasks: ProjectTaskListItem[];
	currentRole: UserRole;
	currentProjectSlug: string;
	activeTaskId: string;
}

export default function ProjectTaskList({
	tasks,
	currentRole,
	currentProjectSlug,
	activeTaskId,
}: ProjectTaskListProps) {
	return (
		<div className="flex flex-col h-full rounded-md border border-border py-2 overflow-y-auto custom-scrollbar max-h-screen">
			<ScrollArea className="flex-grow px-2 py-1">
				{tasks.length > 0 ? (
					<ul className="space-y-1.5 w-full">
						{tasks.map((task) => (
							<TaskItemCard
								key={task.id}
								task={task}
								role={currentRole}
								projectSlug={currentProjectSlug}
								isActive={task.id === activeTaskId}
							/>
						))}
					</ul>
				) : (
					<p className="p-4 text-sm text-center text-muted-foreground">
						No tasks found.
					</p>
				)}
			</ScrollArea>
		</div>
	);
}
