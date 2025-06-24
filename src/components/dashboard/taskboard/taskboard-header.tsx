"use client";

import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppRoutePaths } from "@/config/routes-config";
import type { ProjectMemberDTO } from "@/lib/data-access-layer/DTOs/project.dto";
import { queryKeys } from "@/lib/query/query-keys";
import type { UserRole } from "@/types/auth/auth-types";
import type { KanbanColumnId } from "@/types/dashboard/taskboard-types";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TaskBoardHeaderProps {
	projectName: string;
	userRole: UserRole;
	projectId: number;
	assignees: ProjectMemberDTO[];
	isActionDisabled?: boolean;
	onAddTask: (columnId: KanbanColumnId) => void;
}

export default function TaskBoardHeader({
	projectName,
	userRole,
	projectId,
	assignees,
	onAddTask,
}: TaskBoardHeaderProps) {
	const projectsBasePath =
		userRole === "Freelancer"
			? AppRoutePaths.FreelancerDashboard.Projects.Home
			: AppRoutePaths.ContractorDashboard.Projects.Home;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const queryClient = useQueryClient();

	const handleTaskCreationSuccess = () => {
		queryClient.invalidateQueries({
			queryKey: queryKeys.tasks.byProjectId(projectId),
		});
	};

	return (
		<>
			<CreateTaskModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				projectId={projectId}
				assignees={assignees}
				onSuccess={handleTaskCreationSuccess}
			/>

			<div className="mb-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
					<div className="mb-4">
						<SidebarTrigger className="-ml-1" />
						<h1 className="text-2xl md:text-3xl font-semibold mb-2 text-slate-800 dark:text-slate-100">
							Project Overview
						</h1>
						<p className="text-sm text-slate-500 dark:text-slate-400">
							Track and manage all your tasks for this project in one place.
						</p>
					</div>
					<div className="flex items-center gap-2 flex-shrink-0">
						<Button
							className="bg-slate-800 hover:bg-slate-700 dark:bg-primary dark:hover:bg-primary/90 text-white"
							onClick={() => onAddTask("backlog")}
						>
							<PlusCircle size={16} className="mr-2" />
							Add Task
						</Button>
					</div>
				</div>

				{/* Breadcrumbs */}
				<div className="flex items-center text-sm text-slate-500 dark:text-slate-400 space-x-1.5">
					<Link
						href={projectsBasePath}
						className="hover:underline hover:text-primary"
					>
						Projects
					</Link>
					<ChevronRight size={14} />
					{/* 
				  // TODO: Link to project detail/overview page if it exists */}
					{/* <Link href={`${projectsBasePath}/${projectSlug}`} className="hover:underline hover:text-primary"> */}
					<span className="font-medium text-slate-700 dark:text-slate-200">
						{projectName}
					</span>
					{/* </Link> */}
					<ChevronRight size={14} />
					<span>Task Board</span>
				</div>
			</div>
		</>
	);
}
