import { updateTaskStatusAction } from "@/actions/dashboard/tasks.action";
import type {
	TaskBoardPageData,
	TaskStatus,
} from "@/lib/data-access-layer/DTOs/task.dto";
import { queryKeys } from "@/lib/query/query-keys";
import type {
	KanbanColumnId,
	KanbanColumnType,
	Task,
} from "@/types/dashboard/taskboard-types";
import {
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface UseKanbanDragDropProps {
	projectId: number;
	projectSlug: string;
	columns: KanbanColumnType[];
	onVisualTasksChange: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function useKanbanDragDrop({
	projectId,
	projectSlug,
	columns,
	onVisualTasksChange,
}: UseKanbanDragDropProps) {
	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const [activeColumn, setActiveColumn] = useState<KanbanColumnType | null>(
		null,
	);
	const [dragStartColumnId, setDragStartColumnId] =
		useState<KanbanColumnId | null>(null);

	const queryClient = useQueryClient();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 200, tolerance: 8 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const { mutate: updateTaskStatus } = useMutation({
		mutationFn: updateTaskStatusAction,
		onMutate: async (variables: {
			taskId: string;
			newStatus: string;
			projectId: number;
			projectSlug: string;
		}) => {
			await queryClient.cancelQueries({
				queryKey: queryKeys.tasks.byProjectId(projectId),
			});

			const previousData = queryClient.getQueryData<TaskBoardPageData>(
				queryKeys.tasks.byProjectId(projectId),
			);

			queryClient.setQueryData<TaskBoardPageData>(
				queryKeys.tasks.byProjectId(projectId),
				(oldData) => {
					if (!oldData) return undefined;

					const newTasks = oldData.tasks.map((task) =>
						task.uuid === variables.taskId
							? {
									...task,
									status: variables.newStatus.toLowerCase() as TaskStatus,
								}
							: task,
					);

					return { ...oldData, tasks: newTasks };
				},
			);

			return { previousData };
		},
		onSuccess: (result) => {
			if (result.success) {
				toast.success(result.message || "Task updated successfully!");
			} else {
				toast.error(result.message || "Failed to update task");
				queryClient.invalidateQueries({
					queryKey: queryKeys.tasks.byProjectId(projectId),
				});
			}
		},
		onError: (err, variables, context) => {
			toast.error(`Failed to move task: ${err.message}`);
			if (context?.previousData) {
				queryClient.setQueryData(
					queryKeys.tasks.byProjectId(projectId),
					context.previousData,
				);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.tasks.byProjectId(projectId),
			});
		},
	});

	const handleDragStart = useCallback(
		(event: DragStartEvent, tasks: Task[]) => {
			const { active } = event;
			const task = tasks.find((t) => t.id === active.id);

			if (task) {
				setActiveTask(task);
				setDragStartColumnId(task.columnId);
				const column = columns.find((col) => col.id === task.columnId);
				if (column) setActiveColumn(column);
			}
		},
		[columns],
	);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			const { active, over } = event;
			if (!over || !activeTask) return;

			const activeId = active.id;
			const overId = over.id;
			if (activeId === overId) return;

			const isActiveATask = active.data.current?.type === "Task";
			const isOverATask = over.data.current?.type === "Task";
			const isOverAColumn = over.data.current?.type === "Column";

			if (!isActiveATask) return;

			onVisualTasksChange((prevTasks) => {
				const activeIndex = prevTasks.findIndex((t) => t.id === activeId);
				const overIndex = prevTasks.findIndex((t) => t.id === overId);

				if (isOverAColumn) {
					const overColumnId = over.id as KanbanColumnId;
					if (prevTasks[activeIndex].columnId !== overColumnId) {
						prevTasks[activeIndex].columnId = overColumnId;
						return arrayMove(prevTasks, activeIndex, prevTasks.length - 1);
					}
				}

				if (isOverATask) {
					const overTask = prevTasks.find((t) => t.id === overId);
					if (!overTask) return prevTasks;

					if (prevTasks[activeIndex].columnId !== overTask.columnId) {
						prevTasks[activeIndex].columnId = overTask.columnId;
						return arrayMove(prevTasks, activeIndex, overIndex);
					}
					return arrayMove(prevTasks, activeIndex, overIndex);
				}

				return prevTasks;
			});
		},
		[activeTask, onVisualTasksChange],
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			const originalColumnId = dragStartColumnId;

			setActiveTask(null);
			setActiveColumn(null);
			setDragStartColumnId(null);

			if (!over || active.id === over.id || !originalColumnId) return;

			let finalColumnId: KanbanColumnId | null = null;
			onVisualTasksChange((currentTasks) => {
				const finalTask = currentTasks.find((t) => t.id === active.id);
				if (finalTask) {
					finalColumnId = finalTask.columnId;
				}
				return currentTasks;
			});

			if (!finalColumnId) return;

			if (originalColumnId !== finalColumnId) {
				updateTaskStatus({
					taskId: active.id as string,
					newStatus: finalColumnId,
					projectId,
					projectSlug,
				});
			}

			// Final reordering
			onVisualTasksChange((currentTasks) => {
				const finalTasks: Task[] = [];
				for (const column of columns) {
					const tasksInColumn = currentTasks
						.filter((task) => task.columnId === column.id)
						.map((task, index) => ({ ...task, order: index }));
					finalTasks.push(...tasksInColumn);
				}
				return finalTasks;
			});
		},
		[
			dragStartColumnId,
			projectId,
			projectSlug,
			updateTaskStatus,
			onVisualTasksChange,
			columns,
		],
	);

	return useMemo(
		() => ({
			activeTask,
			activeColumn,
			sensors,

			handleDragStart,
			handleDragOver,
			handleDragEnd,
		}),
		[
			activeTask,
			activeColumn,
			sensors,
			handleDragStart,
			handleDragOver,
			handleDragEnd,
		],
	);
}
