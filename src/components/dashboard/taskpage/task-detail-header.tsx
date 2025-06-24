"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppRoutePaths } from "@/config/routes-config";
import type { UserRole } from "@/types/auth/auth-types";
import type { TaskDetail } from "@/types/dashboard/task-details-types";
import {
	Award,
	Check,
	ChevronRight,
	CircleCheck,
	ListChecks,
	Loader2,
	Share2,
	SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MarkAsDoneModal from "../../modals/mark-as-done-modal";
import SharePopover from "./share-popover";

import { Badge } from "@/components/ui/badge";
import type { useUpdateTaskStatus } from "@/hooks/mutations/use-update-task-status";

interface TaskDetailHeaderGlobalProps {
	task: TaskDetail;
	userRole: UserRole;
	onToggleProjectList?: () => void;
	onTogglePinnedFields?: () => void;
	updateTaskStatus: ReturnType<typeof useUpdateTaskStatus>["mutate"];
	isUpdatingTaskStatus: boolean;
}

export default function TaskDetailHeaderGlobal({
	task,
	userRole,
	onToggleProjectList,
	onTogglePinnedFields,
	updateTaskStatus,
	isUpdatingTaskStatus,
}: TaskDetailHeaderGlobalProps) {
	const [isMarkAsDoneModalOpen, setIsMarkAsDoneModalOpen] = useState(false);

	const projectHomePath =
		userRole === "Freelancer"
			? AppRoutePaths.FreelancerDashboard.Projects.Home
			: AppRoutePaths.ContractorDashboard.Projects.Home;

	const taskboardPath =
		userRole === "Freelancer"
			? AppRoutePaths.FreelancerDashboard.Projects.Taskboard(task.project.slug)
			: AppRoutePaths.ContractorDashboard.Projects.Taskboard(task.project.slug);

	const handleMarkAsDone = () => {
		updateTaskStatus(
			{
				taskId: task.id,
				newStatus: "done",
				projectId: Number.parseInt(task.project.id, 10),
			},
			{
				onSuccess: () => {
					setIsMarkAsDoneModalOpen(true);
				},
			},
		);
	};

	return (
		<div className="mb-4">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
				<div className="flex items-center">
					<div>
						<SidebarTrigger className="-ml-1 mr-2 sm:mr-3" />{" "}
						<h1 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">
							Project Overview
						</h1>
						<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
							Track and manage all your projects in one place.
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
					{/* Mobile Toggles */}
					{onToggleProjectList && (
						<Button
							variant="outline"
							size="icon"
							className="lg:hidden"
							onClick={onToggleProjectList}
							aria-label="Toggle project task list"
						>
							<ListChecks size={18} />
						</Button>
					)}
					{onTogglePinnedFields && (
						<Button
							variant="outline"
							size="icon"
							className="lg:hidden"
							onClick={onTogglePinnedFields}
							aria-label="Toggle task details sidebar"
						>
							<SlidersHorizontal size={18} />
						</Button>
					)}

					{task.columnId === "done" ? (
						<Badge
							variant="outline"
							className="bg-green-100 text-green-700 border-green-300 text-sm px-3 py-1.5 font-medium"
						>
							<Award className="mr-2 h-4 w-4" />
							Completed
						</Badge>
					) : (
						<Button
							className="flex-grow sm:flex-grow-0 bg-slate-800 hover:bg-slate-700 dark:bg-primary dark:hover:bg-primary/90 text-white"
							onClick={handleMarkAsDone}
							disabled={isUpdatingTaskStatus}
						>
							{isUpdatingTaskStatus ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin bg-primary" />
							) : (
								<Check size={16} className="mr-2" />
							)}
							Mark as Done
						</Button>
					)}
				</div>
			</div>
			{/* Section 2: Breadcrumbs and Task-Specific Actions (Share, More) */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
				{/* Breadcrumbs */}
				<div className="flex items-center text-sm text-slate-500 dark:text-slate-400 space-x-1.5 overflow-x-auto py-1">
					<Link
						href={projectHomePath}
						className="hover:underline hover:text-primary flex-shrink-0"
					>
						Projects
					</Link>
					<ChevronRight size={14} className="flex-shrink-0" />
					<Link
						href={taskboardPath}
						className="hover:underline hover:text-primary flex-shrink-0 truncate"
						title={task.project.name}
					>
						{task.project.name}
					</Link>
					<ChevronRight size={14} className="flex-shrink-0" />
					<span className="font-medium text-foreground flex-shrink-0">
						{task.code}
					</span>
				</div>

				{/* Task Actions */}
				<div className="flex items-center gap-2 flex-shrink-0">
					<SharePopover
						taskUrl={typeof window !== "undefined" ? window.location.href : ""}
					>
						<Button variant="outline" size="sm" className="gap-1.5">
							<Share2 size={16} /> Share
						</Button>
					</SharePopover>
					{/* <DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-muted-foreground hover:text-foreground"
							>
								<MoreHorizontal size={18} />
								<span className="sr-only">More options</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => alert("Edit Task clicked")}>
								Edit Task
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => alert("Archive Task clicked")}>
								Archive Task
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href={taskboardPath} className="flex items-center w-full">
									<ExternalLink size={14} className="mr-2" /> Go to all issues
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu> */}
				</div>
			</div>
			<MarkAsDoneModal
				isOpen={isMarkAsDoneModalOpen}
				onOpenChange={setIsMarkAsDoneModalOpen}
				taskName={task.title}
				projectName={task.project.name}
				projectId={task.project.id}
				userRole={userRole}
			/>
		</div>
	);
}
