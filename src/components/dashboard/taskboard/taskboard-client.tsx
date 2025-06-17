"use client";

import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { useTaskboardState } from "@/hooks/taskboard/use-taskboard-state";
import { staticTaskBoardData } from "@/lib/constants";
import { queryKeys } from "@/lib/query/query-keys";
import type { UserRole } from "@/types/auth/auth-types";
import type { KanbanColumnId } from "@/types/dashboard/taskboard-types";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense, useCallback, useState } from "react";
import KanbanBoard from "./kanban-board";
import { KanbanBoardSkeleton } from "./kanban-board-skeleton";
import { TaskBoardErrorState } from "./taskboard-error-state";
import TaskBoardFilterBar from "./taskboard-filter-bar";
import TaskBoardHeader from "./taskboard-header";
import { TaskBoardPageSkeleton } from "./taskboard-page-skeleton.tsx";

interface TaskBoardClientProps {
	userRole: UserRole;
	projectId: number;
	projectSlug: string;
}

export function TaskBoardClient({
	userRole,
	projectId,
	projectSlug,
}: TaskBoardClientProps) {
	const {
		data,
		isLoading,
		error,
		isFetching,
		filters,
		setFilters,
		visualTasks,
		setVisualTasks,
		displayedTasks,
	} = useTaskboardState(projectId);

	const queryClient = useQueryClient();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalInitialStatus, setModalInitialStatus] =
		useState<KanbanColumnId>("backlog");

	const handleOpenCreateTaskModal = (status: KanbanColumnId) => {
		setModalInitialStatus(status);
		setIsModalOpen(true);
	};

	const handleTaskCreationSuccess = useCallback(() => {
		queryClient.invalidateQueries({
			queryKey: queryKeys.tasks.byProjectId(projectId),
		});
	}, [queryClient, projectId]);

	const handleRetry = useCallback(() => {
		queryClient.invalidateQueries({
			queryKey: queryKeys.tasks.byProjectId(projectId),
		});
	}, [queryClient, projectId]);

	const renderContent = () => {
		if (isLoading) {
			return <KanbanBoardSkeleton />;
		}

		if (error && !data) {
			return (
				<TaskBoardErrorState
					errorMessage={error.message}
					onRetry={handleRetry}
				/>
			);
		}

		if (data) {
			const kanbanData = {
				projectId: data.project.id,
				projectName: data.project.title,
				columns: staticTaskBoardData.columns,
				tasks: displayedTasks,
			};

			return (
				<KanbanBoard
					initialData={kanbanData}
					userRole={userRole}
					projectSlug={projectSlug}
					projectId={projectId}
					onAddTask={handleOpenCreateTaskModal}
					onVisualTasksChange={setVisualTasks}
				/>
			);
		}

		return <div>Unable to load task board.</div>;
	};

	return (
		<>
			<CreateTaskModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				projectId={projectId}
				assignees={data?.members || []}
				onSuccess={handleTaskCreationSuccess}
				initialStatus={modalInitialStatus}
			/>
			<div className="flex flex-col h-full max-h-full overflow-hidden bg-transparent dark:bg-slate-900">
				<div className="p-4 flex-shrink-0">
					<TaskBoardHeader
						projectName={data?.project.title || "Loading..."}
						userRole={userRole}
						projectId={projectId}
						assignees={data?.members || []}
						isActionDisabled={!data}
						onAddTask={handleOpenCreateTaskModal}
					/>
					<TaskBoardFilterBar
						assignees={data?.members || []}
						filters={filters}
						onFilterChange={setFilters}
						isDisabled={!data || data.tasks.length === 0}
					/>
				</div>
				<div className="flex-grow overflow-x-auto custom-scrollbar">
					<div className="h-full min-w-max flex">
						<Suspense fallback={<TaskBoardPageSkeleton />}>
							{renderContent()}
							{isFetching && !isLoading && (
								<div className="absolute bottom-4 right-4 bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg animate-pulse">
									Syncing...
								</div>
							)}
						</Suspense>
					</div>
				</div>
			</div>
		</>
	);
}
