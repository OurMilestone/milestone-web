"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateSubtask } from "@/hooks/mutations/use-update-subtask";
import { staticTaskBoardData } from "@/lib/constants";
import { cn, getInitials } from "@/lib/utils";
import type { Subtask } from "@/types/dashboard/task-details-types";
import type { KanbanColumnId } from "@/types/dashboard/taskboard-types";
import { ChevronDown, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { PriorityDots } from "../taskboard/task-card";

interface SubtaskItemProps {
	subtask: Subtask;
	parentTaskId: number;
	parentTaskUuid: string;
}

export default function SubtaskItem({
	subtask: initialSubtask,
	parentTaskId,
	parentTaskUuid,
}: SubtaskItemProps) {
	const router = useRouter();

	const updateSubtaskMutation = useUpdateSubtask(parentTaskId, parentTaskUuid);

	const subtask = initialSubtask;
	const isLoading = updateSubtaskMutation.isPending;

	const isCompleted = subtask.isCompleted;
	const subtaskCompletedStyles = isCompleted ? "opacity-75" : "opacity-100";

	const currentStatusInfo = staticTaskBoardData.columns.find(
		(col) => col.id === subtask.columnId,
	);

	const handleStatusChange = async (newStatus: KanbanColumnId) => {
		const newCompletedState = newStatus === "done";

		const columnIdToStatusMap = {
			backlog: "BACKLOG",
			in_progress: "IN_PROGRESS",
			in_review: "IN_REVIEW",
			done: "DONE",
		} as const;

		updateSubtaskMutation.mutate({
			subtaskId: subtask.uuid,
			data: {
				status: columnIdToStatusMap[newStatus],
			},
		});
	};

	const handleCheckboxChange = () => {
		const newCompletedState = !isCompleted;

		const newStatus = newCompletedState ? "DONE" : "BACKLOG";

		updateSubtaskMutation.mutate({
			subtaskId: subtask.uuid,
			data: {
				status: newStatus,
			},
		});
	};

	return (
		<li
			className={cn(
				"flex items-center gap-3 p-2.5 border rounded-md bg-card hover:bg-muted/50 transition-all duration-150",
				subtaskCompletedStyles,
			)}
		>
			<Checkbox
				id={`subtask-${subtask.uuid}`}
				checked={isCompleted}
				onCheckedChange={handleCheckboxChange}
				aria-label={`Mark subtask ${subtask.title} as ${
					isCompleted ? "incomplete" : "complete"
				}`}
				disabled={isLoading}
			/>
			<div className="flex-1 min-w-0 space-y-0.5">
				<div className="flex items-center gap-2">
					<span className="text-xs text-muted-foreground">{subtask.code}</span>
					<label
						htmlFor={`subtask-${subtask.uuid}`}
						className={cn(
							"text-sm font-medium text-foreground cursor-pointer truncate",
						)}
						title={subtask.title}
					>
						{subtask.title}
					</label>
				</div>
			</div>

			<div className="flex items-center gap-2 ml-auto flex-shrink-0">
				<PriorityDots priority={subtask.priority} />

				{subtask.assignee && (
					<Avatar className="h-6 w-6">
						<AvatarFallback className="text-[10px]">
							{getInitials(subtask.assignee.name)}
						</AvatarFallback>
					</Avatar>
				)}

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-7 px-2 py-1 text-xs gap-1 bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700"
							disabled={isLoading}
						>
							<span className="truncate max-w-[70px]">
								{currentStatusInfo?.title || "Status"}
							</span>
							<ChevronDown size={14} className="opacity-70" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{staticTaskBoardData.columns.map((statusCol) => (
							<DropdownMenuItem
								key={statusCol.id}
								onClick={() => handleStatusChange(statusCol.id)}
								disabled={subtask.columnId === statusCol.id || isLoading}
							>
								{statusCol.title}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</li>
	);
}
