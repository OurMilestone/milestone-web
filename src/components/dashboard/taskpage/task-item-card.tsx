"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppRoutePaths } from "@/config/routes-config";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import type { ProjectTaskListItem } from "@/types/dashboard/task-details-types";
import Link from "next/link";

interface TaskItemCardProps {
	task: ProjectTaskListItem;
	role: UserRole;
	projectSlug: string;
	isActive: boolean;
}

export default function TaskItemCard({
	task,
	role,
	projectSlug,
	isActive,
}: TaskItemCardProps) {
	const taskDetailPath =
		role === "Freelancer"
			? AppRoutePaths.FreelancerDashboard.Projects.TaskDetail(
					projectSlug,
					task.id,
				)
			: AppRoutePaths.ContractorDashboard.Projects.TaskDetail(
					projectSlug,
					task.id,
				);

	return (
		<li>
			<Link
				href={taskDetailPath}
				className={cn(
					"block border border-border p-2.5 rounded-md hover:bg-muted dark:hover:bg-slate-700/70 transition-colors",
					isActive
						? "bg-primary/10 text-black dark:bg-primary/20"
						: "bg-card dark:bg-slate-800",
				)}
			>
				<p
					className={cn(
						"text-sm font-normal leading-snug mb-1",
						isActive ? "text-[#010B24]" : "text-foreground",
					)}
					title={task.title}
				>
					{task.title}
				</p>

				<div className="flex items-center justify-between">
					<span
						className={cn(
							"text-xs font-medium",
							isActive ? "text-primary" : "text-muted-foreground",
						)}
					>
						{task.code}
					</span>
					{task.assignee && (
						<Avatar className="h-5 w-5">
							<AvatarImage
								src={task.assignee.avatarUrl}
								alt={task.assignee.initials}
							/>
							<AvatarFallback className="text-xs">
								{task.assignee.initials}
							</AvatarFallback>
						</Avatar>
					)}
				</div>
			</Link>
		</li>
	);
}
