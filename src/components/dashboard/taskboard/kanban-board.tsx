"use client";

import type { UserRole } from "@/types/auth/auth-types";
import type {
	KanbanColumnId,
	KanbanColumnType,
	ProjectTaskBoardData,
	Task,
} from "@/types/dashboard/taskboard-types";
import {
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	type DropAnimation,
	KeyboardSensor,
	MeasuringStrategy,
	PointerSensor,
	closestCorners,
	defaultDropAnimationSideEffects,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import KanbanColumn from "./kanban-column";
import TaskCard from "./task-card";

const dropAnimation: DropAnimation = {
	sideEffects: defaultDropAnimationSideEffects({
		styles: { active: { opacity: "0.5" } },
	}),
};

interface KanbanBoardProps {
	initialData: ProjectTaskBoardData;
	userRole: UserRole;
	projectSlug: string;
}

export default function KanbanBoard({
	initialData,
	userRole,
	projectSlug,
}: KanbanBoardProps) {
	const [columns, setColumns] = useState<KanbanColumnType[]>(
		initialData.columns,
	);
	const [tasks, setTasks] = useState<Task[]>(
		initialData.tasks.sort((a, b) => a.order - b.order),
	);
	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const [activeColumn, setActiveColumn] = useState<KanbanColumnType | null>(
		null,
	);

	const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

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

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const task = tasks.find((t) => t.id === active.id);

		if (task) {
			setActiveTask(task);
			const column = columns.find((col) => col.id === task.columnId);

			if (column) setActiveColumn(column);
		}
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over || !activeTask) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		const isActiveATask = active.data.current?.type === "Task";
		const isOverATask = over.data.current?.type === "Task";
		const isOverAColumn = over.data.current?.type === "Column";

		if (!isActiveATask) return;

		if (isOverAColumn) {
			const overColumnId = over.id as KanbanColumnId;

			if (activeTask.columnId !== overColumnId) {
				setTasks((prevTasks) => {
					const activeTaskIndex = prevTasks.findIndex((t) => t.id === activeId);
					if (activeTaskIndex === -1) return prevTasks;

					// Update task's columnId and reset its order within the new column
					// The actual reordering will happen in onDragEnd
					const updatedTasks = [...prevTasks];
					updatedTasks[activeTaskIndex] = {
						...updatedTasks[activeTaskIndex],
						columnId: overColumnId,
					};
					return updatedTasks;
				});
			}
		}

		// Dragging a Task over another Task (for reordering within the same column)
		if (isOverATask) {
			const overTask = tasks.find((t) => t.id === overId);

			if (overTask && activeTask.columnId === overTask.columnId) {
				// Reordering within the same column
				setTasks((prevTasks) => {
					const activeIndex = prevTasks.findIndex((t) => t.id === activeId);
					const overIndex = prevTasks.findIndex((t) => t.id === overId);

					if (activeIndex !== overIndex) {
						return arrayMove(prevTasks, activeIndex, overIndex);
					}

					return prevTasks;
				});
			} else if (overTask && activeTask.columnId !== overTask.columnId) {
				// Dragging task to a new column by dropping on a task in that column
				setTasks((prevTasks) => {
					const activeTaskIndex = prevTasks.findIndex((t) => t.id === activeId);

					if (activeTaskIndex === -1) return prevTasks;

					const updatedTasks = [...prevTasks];

					updatedTasks[activeTaskIndex] = {
						...updatedTasks[activeTaskIndex],
						columnId: overTask.columnId,
					};
					// Reorder within the new column
					return arrayMove(
						updatedTasks,
						activeTaskIndex,
						prevTasks.findIndex((t) => t.id === overId),
					);
				});
			}
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		setActiveTask(null);
		setActiveColumn(null);

		const { active, over } = event;

		if (!over || !active.data.current?.task) return;

		const activeId = active.id as string;
		const draggedTask = active.data.current.task as Task;

		let newColumnId = draggedTask.columnId;
		const overId = over.id as string;

		if (over.data.current?.type === "Column") {
			newColumnId = over.id as KanbanColumnId;
		} else if (over.data.current?.type === "Task") {
			const overTask = tasks.find((t) => t.id === over.id);

			if (overTask) {
				newColumnId = overTask.columnId;
			}
		}

		setTasks((prevTasks) => {
			const activeTaskIndex = prevTasks.findIndex((t) => t.id === activeId);
			if (activeTaskIndex === -1) return prevTasks;

			let updatedTasks = [...prevTasks];
			// Update column if it changed
			updatedTasks[activeTaskIndex] = {
				...updatedTasks[activeTaskIndex],
				columnId: newColumnId,
			};

			// If dropped over a task, use arrayMove to place it correctly
			if (over.data.current?.type === "Task" && activeId !== overId) {
				const overTaskIndex = updatedTasks.findIndex((t) => t.id === overId);
				if (overTaskIndex !== -1) {
					updatedTasks = arrayMove(
						updatedTasks,
						activeTaskIndex,
						overTaskIndex,
					);
				}
			}

			// Recalculate order for all tasks within their respective columns
			const finalTasks: Task[] = [];
			// biome-ignore lint/complexity/noForEach: <explanation>
			columns.forEach((column) => {
				const tasksInColumn = updatedTasks
					.filter((task) => task.columnId === column.id)
					.map((task, index) => ({ ...task, order: index }));
				finalTasks.push(...tasksInColumn);
			});

			console.log("DragEnd: Final tasks state:", finalTasks);
			// TODO: API Call to persist task changes (new columnId and order)
			// Example: await updateTaskOrderAndColumn(activeId, newColumnId, newOrder);
			return finalTasks;
		});
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
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
					/>
				))}
			</div>
			{typeof document !== "undefined" &&
				createPortal(
					<DragOverlay dropAnimation={null}>
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
