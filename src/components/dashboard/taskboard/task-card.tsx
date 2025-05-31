"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppRoutePaths } from "@/config/routes-config";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import type { Task } from "@/types/dashboard/taskboard-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquare, GripVertical } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

interface TaskCardProps {
	task: Task;
	isDraggingOverlay?: boolean;
	userRole: UserRole;
	projectSlug: string;
}

export const PriorityDots = ({ priority }: { priority: Task["priority"] }) => {
	let color = "bg-gray-400";
	let count = 1;
	switch (priority) {
		case "low":
			color = "bg-green-500";
			count = 1;
			break;
		case "medium":
			color = "bg-yellow-500";
			count = 2;
			break;
		case "high":
			color = "bg-orange-500";
			count = 3;
			break;
		case "urgent":
			color = "bg-red-500";
			count = 4;
			break;
	}
	return (
		<div className="flex items-center gap-0.5" title={`Priority: ${priority}`}>
			{Array.from({ length: count }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey:
				<span key={i} className={cn("h-1.5 w-1.5 rounded-full", color)} />
			))}
		</div>
	);
};

export default function TaskCard({
	task,
	isDraggingOverlay,
	userRole,
	projectSlug,
}: TaskCardProps) {
	const router = useRouter();

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: {
			type: "Task",
			task,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 100 : undefined,
	};

	const overlayStyle = isDraggingOverlay
		? {
				boxShadow:
					"0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
				cursor: "grabbing",
				transform: "scale(1.03)",
				zIndex: 50,
			}
		: {};

	const handleCardClick = () => {
		if (isDragging || isDraggingOverlay) return;

		let taskDetailPath = "";

		if (userRole === "Freelancer") {
			taskDetailPath = AppRoutePaths.FreelancerDashboard.Projects.TaskDetail(
				projectSlug,
				task.id,
			);
		} else if (userRole === "Contractor") {
			taskDetailPath = AppRoutePaths.ContractorDashboard.Projects.TaskDetail(
				projectSlug,
				task.id,
			);
		}

		if (taskDetailPath) {
			router.push(taskDetailPath);
		} else {
			console.warn(
				"Could not determine task detail path for role:",
				userRole,
				"or missing slug/ID.",
			);
		}
	};

	return (
		<Card
			ref={setNodeRef}
			style={isDraggingOverlay ? {} : style}
			{...attributes}
			className={cn(
				"mb-3 py-1 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-150 rounded-lg",
				isDraggingOverlay ? "cursor-grabbing shadow-xl" : "cursor-pointer",
				isDragging && !isDraggingOverlay
					? "opacity-50 shadow-xl z-50"
					: "opacity-100",
			)}
		>
			{
				<div style={isDraggingOverlay ? overlayStyle : {}}>
					<CardContent
						className="py-1 px-2 space-y-2"
						onClick={!isDraggingOverlay ? handleCardClick : undefined}
						onKeyDown={
							!isDraggingOverlay
								? (e) => {
										if (e.key === "Enter" || e.key === " ") handleCardClick();
									}
								: undefined
						}
						role={!isDraggingOverlay ? "button" : undefined}
						tabIndex={!isDraggingOverlay ? 0 : undefined}
						aria-label={
							!isDraggingOverlay ? `View task: ${task.title}` : undefined
						}
					>
						<div className="flex justify-between items-start">
							<p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug pr-2">
								{task.title}
							</p>
							<button
								{...listeners}
								className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded flex-shrink-0"
								aria-label="Drag task to re-order or move"
								onClick={(e) => e.stopPropagation()}
								onKeyDown={(e) => e.stopPropagation()}
								tabIndex={isDraggingOverlay ? -1 : 0}
							>
								<GripVertical size={16} />
							</button>
						</div>

						{task.labels && task.labels.length > 0 && (
							<div className="flex flex-wrap gap-1">
								{task.labels.map((label) => (
									<Badge
										key={label.id}
										variant="outline"
										className={cn(
											"text-xs px-1.5 py-0.5 font-normal border",
											label.colorClasses,
										)}
									>
										{label.name}
									</Badge>
								))}
							</div>
						)}

						<div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
							<div className="flex items-center gap-1.5">
								<CheckSquare size={14} className="text-inherit" />
								<span>{task.code}</span>
							</div>
							<div className="flex items-center gap-2">
								<PriorityDots priority={task.priority} />
								{task.assignees && task.assignees.length > 0 && (
									<Avatar className="h-5 w-5">
										<AvatarImage
											src={task.assignees[0].avatarUrl}
											alt={task.assignees[0].name}
										/>
										<AvatarFallback className="text-xs">
											{task.assignees[0].initials}
										</AvatarFallback>
									</Avatar>
								)}
							</div>
						</div>
					</CardContent>
				</div>
			}
		</Card>
	);
}
