import { useTaskBoardData } from "@/hooks/queries/use-taskboard";
import { transformApiTaskToUiTask } from "@/lib/utils";
import type {
	Task,
	TaskFilters,
	TaskPriority,
} from "@/types/dashboard/taskboard-types";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useTaskboardState(projectId: number) {
	const { data, isLoading, error, isFetching } = useTaskBoardData(projectId);

	const [filters, setFilters] = useState<TaskFilters>({
		searchTerm: "",
		assigneeIds: [],
		labels: [],
		priority: null,
	});

	const [visualTasks, setVisualTasks] = useState<Task[]>([]);

	const transformedTasks = useMemo(() => {
		if (!data?.tasks) return [];
		return data.tasks.map(transformApiTaskToUiTask);
	}, [data?.tasks]);

	const handleFilterChange = useCallback((newFilters: TaskFilters) => {
		setFilters(newFilters);
	}, []);

	const handleVisualTasksChange = useCallback(
		(updater: React.SetStateAction<Task[]>) => {
			setVisualTasks(updater);
		},
		[],
	);

	useEffect(() => {
		setVisualTasks(transformedTasks);
	}, [transformedTasks]);

	useEffect(() => {
		if (data?.tasks && !isFetching) {
			const newTransformedTasks = data.tasks.map(transformApiTaskToUiTask);
			setVisualTasks(newTransformedTasks);
		}
	}, [data?.tasks, isFetching]);

	const displayedTasks = useMemo(() => {
		return visualTasks.filter((task) => {
			const searchMatch =
				filters.searchTerm === "" ||
				task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
				task.code.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
				(task.description
					?.toLowerCase()
					.includes(filters.searchTerm.toLowerCase()) ??
					false);

			const assigneeMatch =
				filters.assigneeIds.length === 0 ||
				task.assignees?.some((a) => filters.assigneeIds.includes(a.id));

			const labelMatch =
				filters.labels.length === 0 ||
				task.labels?.some((l) => filters.labels.includes(l.name));

			const priorityMatch =
				!filters.priority || task.priority === filters.priority;

			return searchMatch && assigneeMatch && labelMatch && priorityMatch;
		});
	}, [visualTasks, filters]);

	return useMemo(
		() => ({
			data,
			isLoading,
			error,
			isFetching,
			filters,
			setFilters: handleFilterChange,
			visualTasks,
			setVisualTasks: handleVisualTasksChange,
			transformedTasks,
			displayedTasks,
		}),
		[
			data,
			isLoading,
			error,
			isFetching,
			filters,
			handleFilterChange,
			visualTasks,
			handleVisualTasksChange,
			transformedTasks,
			displayedTasks,
		],
	);
}
