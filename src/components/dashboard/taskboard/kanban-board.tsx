"use client";

import { useKanbanDragDrop } from "@/hooks/taskboard/use-kanban-drag-drop";
import type { UserRole } from "@/types/auth/auth-types";
import type {
	KanbanColumnId,
	KanbanColumnType,
	ProjectTaskBoardData,
	Task,
} from "@/types/dashboard/taskboard-types";
import {
	DndContext,
	DragOverlay,
	type DropAnimation,
	MeasuringStrategy,
	closestCorners,
	defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import KanbanColumn from "./kanban-column";
import TaskCard from "./task-card";

const dropAnimation: DropAnimation = {
	sideEffects: defaultDropAnimationSideEffects({
		styles: {
			active: {
				opacity: "0.5",
			},
		},
	}),
};

interface KanbanBoardProps {
	initialData: ProjectTaskBoardData;
	userRole: UserRole;
	projectSlug: string;
	projectId: number;
	onAddTask: (columnId: KanbanColumnId) => void;
	onVisualTasksChange: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function KanbanBoard({
	initialData,
	userRole,
	projectSlug,
	projectId,
	onAddTask,
	onVisualTasksChange,
}: KanbanBoardProps) {
	const [columns] = useState<KanbanColumnType[]>(initialData.columns);
	const tasks = initialData.tasks;

	const {
		activeTask,
		activeColumn,
		sensors,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	} = useKanbanDragDrop({
		projectId,
		projectSlug,
		columns,
		onVisualTasksChange,
	});

	const tasksByColumn = useMemo(() => {
		return columns.reduce(
			(acc, column) => {
				acc[column.id] = tasks
					.filter((task) => task.columnId === column.id)
					.sort((a, b) => a.order - b.order);
				return acc;
			},
			{} as Record<KanbanColumnId, Task[]>,
		);
	}, [tasks, columns]);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={(event) => handleDragStart(event, tasks)}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
		>
			<div className="flex gap-4 p-1 pb-2 h-full items-start">
				{columns.map((column) => (
					<KanbanColumn
						key={column.id}
						column={column}
						tasksInThisColumn={tasksByColumn[column.id] || []}
						userRole={userRole}
						projectSlug={projectSlug}
						onAddTask={() => onAddTask(column.id)}
						isActive={activeColumn?.id === column.id}
					/>
				))}
			</div>
			{typeof document !== "undefined" &&
				createPortal(
					<DragOverlay dropAnimation={dropAnimation}>
						{activeTask ? (
							<TaskCard
								task={activeTask}
								isDraggingOverlay
								userRole={userRole}
								projectSlug={projectSlug}
							/>
						) : null}
					</DragOverlay>,
					document.body,
				)}
		</DndContext>
	);
}
