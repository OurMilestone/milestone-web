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
import { Input } from "@/components/ui/input"; // Added Input
import { useDeleteSubtask } from "@/hooks/mutations/use-delete-subtask";
import { useUpdateSubtask } from "@/hooks/mutations/use-update-subtask";
import { staticTaskBoardData } from "@/lib/constants";
import { cn, getInitials } from "@/lib/utils";
import type { Subtask } from "@/types/dashboard/task-details-types";
import type { KanbanColumnId } from "@/types/dashboard/taskboard-types";
import { ChevronDown, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
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
	const deleteSubtaskMutation = useDeleteSubtask(parentTaskId, parentTaskUuid);

	const subtask = initialSubtask;
	const isLoading =
		updateSubtaskMutation.isPending || deleteSubtaskMutation.isPending;

	const isCompleted = subtask.isCompleted;
	const subtaskCompletedStyles = isCompleted ? "opacity-75" : "opacity-100";

	const currentStatusInfo = staticTaskBoardData.columns.find(
		(col) => col.id === subtask.columnId,
	);

	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [editedTitle, setEditedTitle] = useState(subtask.title);

	const handleStatusChange = async (newStatus: KanbanColumnId) => {
		const newCompletedState = newStatus === "done";

		const columnIdToStatusMap = {
			backlog: "BACKLOG",
			in_progress: "IN_PROGRESS",
			in_review: "IN_REVIEW",
			done: "DONE",
		} as const;

		updateSubtaskMutation.mutate({
			subtaskUuid: subtask.uuid,
			data: {
				status: columnIdToStatusMap[newStatus],
			},
		});
	};

	const handleCheckboxChange = () => {
		const newCompletedState = !isCompleted;

		const newStatus = newCompletedState ? "DONE" : "BACKLOG";

		updateSubtaskMutation.mutate({
			subtaskUuid: subtask.uuid,
			data: {
				status: newStatus,
			},
		});
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedTitle(e.target.value);
	};

	const handleTitleBlur = () => {
		if (editedTitle !== subtask.title) {
			updateSubtaskMutation.mutate({
				subtaskUuid: subtask.uuid,
				data: {
					title: editedTitle,
				},
			});
		}
		setIsEditingTitle(false);
	};

	const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleTitleBlur();
		}
	};

	const handleDeleteSubtask = () => {
		deleteSubtaskMutation.mutate(subtask.uuid);
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
				className="cursor-pointer"
			/>
			<div className="flex-1 min-w-0 space-y-0.5">
				{isEditingTitle ? (
					<Input
						value={editedTitle}
						onChange={handleTitleChange}
						onBlur={handleTitleBlur}
						onKeyDown={handleTitleKeyDown}
						className="text-sm font-medium text-foreground truncate"
						autoFocus
					/>
				) : (
					<div className="flex items-center gap-2">
						<span
							className={cn("text-sm font-medium text-foreground truncate")}
							title={subtask.title}
						>
							{subtask.title}
						</span>
						<Edit2
							size={14}
							className="cursor-pointer text-muted-foreground"
							onClick={() => setIsEditingTitle(true)}
						/>
					</div>
				)}
				{subtask.description && (
					<p className="text-xs text-muted-foreground line-clamp-2">
						{subtask.description}
					</p>
				)}
				<span className="text-xs text-muted-foreground">{subtask.code}</span>
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

				<Button
					variant="ghost"
					size="icon"
					className="h-7 w-7 text-muted-foreground hover:text-destructive"
					onClick={handleDeleteSubtask}
					disabled={isLoading}
				>
					<Trash2 size={16} />
				</Button>
			</div>
		</li>
	);
}
