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
import { format, parseISO } from "date-fns";
import { ChevronDown, Edit2, Minus, Trash2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useRef, useState } from "react";
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

	// Expand/collapse state for description
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
	const [isDescriptionOverflowing, setIsDescriptionOverflowing] =
		useState(false);
	const descriptionRef = useRef<HTMLParagraphElement>(null);
	const setDescriptionRef = (el: HTMLParagraphElement | null) => {
		descriptionRef.current = el;
		if (el) {
			setIsDescriptionOverflowing(el.scrollHeight > el.clientHeight + 2);
		}
	};

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
				"flex flex-col md:flex-row flex-wrap items-center md:items-start gap-3 p-2.5 border rounded-md bg-card hover:bg-muted/50 transition-all duration-150",
				subtaskCompletedStyles,
			)}
		>
			<div className="flex gap-3">
				<Checkbox
					id={`subtask-${subtask.uuid}`}
					checked={isCompleted}
					onCheckedChange={handleCheckboxChange}
					aria-label={`Mark subtask ${subtask.title} as ${
						isCompleted ? "incomplete" : "complete"
					}`}
					disabled={isLoading}
					className="cursor-pointer hidden md:block"
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
								className={cn(
									"text-sm font-medium line-clamp-1 text-foreground truncate",
								)}
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
						<div className="mb-1">
							<p
								className={cn(
									"text-xs text-muted-foreground",
									!isDescriptionExpanded && "line-clamp-2",
								)}
								ref={setDescriptionRef}
							>
								{subtask.description}
							</p>
							{isDescriptionOverflowing && (
								<button
									type="button"
									className="text-xs text-primary underline mt-1 focus:outline-none"
									onClick={() => setIsDescriptionExpanded((prev) => !prev)}
								>
									{isDescriptionExpanded ? "Collapse" : "Expand"}
								</button>
							)}
						</div>
					)}
					<div className="flex flex-wrap items-center gap-y-0.5 gap-x-2">
						<span className="text-xs text-muted-foreground">
							{subtask.code}
						</span>
						<Minus className="size-2 text-muted-foreground" />
						<div className="text-muted-foreground text-xs">
							<span className="font-medium">Created:</span>{" "}
							{format(parseISO(subtask.createdAt), "MMM dd, yyyy · hh:mma")}
						</div>
						<div className="text-muted-foreground text-xs">
							<span className="font-medium">Updated:</span>{" "}
							{format(parseISO(subtask.updatedAt), "MMM dd, yyyy · hh:mma")}
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-between items-center w-full">
				<Checkbox
					id={`subtask-${subtask.uuid}`}
					checked={isCompleted}
					onCheckedChange={handleCheckboxChange}
					aria-label={`Mark subtask ${subtask.title} as ${
						isCompleted ? "incomplete" : "complete"
					}`}
					disabled={isLoading}
					className="cursor-pointer block md:hidden"
				/>

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
			</div>
		</li>
	);
}
