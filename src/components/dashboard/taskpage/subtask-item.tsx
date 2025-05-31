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
import { staticTaskBoardData } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Subtask } from "@/types/dashboard/task-details-types";
import type { KanbanColumnId } from "@/types/dashboard/taskboard-types";
import { ChevronDown, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { toast } from "sonner";
import { PriorityDots } from "../taskboard/task-card";

//Todo: Implement actual api server action. For now this will do.
async function updateSubtaskStatusAPI(
	subtaskId: string,
	newStatus: KanbanColumnId,
	newCompletedState: boolean,
): Promise<{
	success: boolean;
	updatedStatus: KanbanColumnId;
	updatedCompletedState: boolean;
}> {
	console.log(
		`API CALL: Updating subtask ${subtaskId} status to ${newStatus}, completed: ${newCompletedState}`,
	);
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				success: true,
				updatedStatus: newStatus,
				updatedCompletedState: newCompletedState,
			});
		}, 500);
	});
}

interface SubtaskItemProps {
	subtask: Subtask;
	onToggleComplete: (
		subtaskId: string,
		currentIsCompleted: boolean,
		newColumnIdIfDone?: KanbanColumnId,
	) => void;
	// onEdit: (subtaskId: string) => void; // * We might implement subtask editing, deletion or creation via callbacks
	// onDelete: (subtaskId: string) => void;
}

export default function SubtaskItem({
	subtask: initialSubtask,
	onToggleComplete,
}: SubtaskItemProps) {
	const router = useRouter();

	// Internal state for subtask to manage optimistic updates for status
	const [subtask, setSubtask] = useState<Subtask>(initialSubtask);
	const [isLoading, setIsLoading] = useState(false);

	const handleEdit = () => alert(`Edit subtask: ${subtask.title}`);
	const handleDelete = () => alert(`Delete subtask: ${subtask.title}`);

	const currentStatusInfo = staticTaskBoardData.columns.find(
		(col) => col.id === subtask.columnId,
	);

	const subtaskCompletedStyles = subtask.isCompleted
		? "opacity-75"
		: "opacity-100";

	const handleStatusChange = async (newStatus: KanbanColumnId) => {
		setIsLoading(true);
		const newCompletedState = newStatus === "done";

		toast.promise(
			updateSubtaskStatusAPI(subtask.id, newStatus, newCompletedState),
			{
				loading: "Updating status...",
				success: (data) => {
					setSubtask((prev) => ({
						...prev,
						columnId: data.updatedStatus,
						isCompleted: data.updatedCompletedState,
					}));
					// If the parent TaskSubtasks needs to know about completion state change due to status
					if (subtask.isCompleted !== data.updatedCompletedState) {
						onToggleComplete(
							subtask.id,
							subtask.isCompleted,
							data.updatedStatus,
						);
					}
					// router.refresh(); // I could refresh parent if subtask list is server-rendered
					return "Status updated!";
				},
				error: "Failed to update status.",
				finally: () => setIsLoading(false),
			},
		);
	};

	const handleCheckboxChange = () => {
		const newCompletedState = !subtask.isCompleted;

		// If checking as done, set status to 'done'. If unchecking, revert to 'backlog' (or previous non-done status).
		const newStatus = newCompletedState
			? "done"
			: subtask.columnId === "done"
				? "backlog"
				: subtask.columnId;

		setIsLoading(true);
		toast.promise(
			updateSubtaskStatusAPI(subtask.id, newStatus, newCompletedState),
			{
				loading: "Updating...",
				success: (data) => {
					setSubtask((prev) => ({
						...prev,
						columnId: data.updatedStatus,
						isCompleted: data.updatedCompletedState,
					}));
					onToggleComplete(
						subtask.id,
						!data.updatedCompletedState,
						data.updatedStatus,
					);
					return "Task updated!";
				},
				error: "Failed to update.",
				finally: () => setIsLoading(false),
			},
		);
	};

	return (
		<li
			className={cn(
				"flex items-center gap-3 p-2.5 border rounded-md bg-card hover:bg-muted/50 transition-all duration-150",
				subtaskCompletedStyles,
			)}
		>
			<Checkbox
				id={`subtask-${subtask.id}`}
				checked={subtask.isCompleted}
				onCheckedChange={handleCheckboxChange}
				aria-label={`Mark subtask ${subtask.title} as ${
					subtask.isCompleted ? "incomplete" : "complete"
				}`}
				disabled={isLoading}
			/>
			<div className="flex-1 min-w-0 space-y-0.5">
				<div className="flex items-center gap-2">
					<span className="text-xs text-muted-foreground">{subtask.code}</span>
					<label
						htmlFor={`subtask-${subtask.id}`}
						className={cn(
							"text-sm font-medium text-foreground cursor-pointer truncate",
						)}
						title={subtask.title}
					>
						{subtask.title}
					</label>
				</div>
			</div>

			{/* Right side elements: Priority, Assignee, Status Dropdown, More Options */}
			<div className="flex items-center gap-2 ml-auto flex-shrink-0">
				<PriorityDots priority={subtask.priority} />

				{subtask.assignee && (
					<Avatar className="h-6 w-6">
						<AvatarImage
							src={subtask.assignee.avatarUrl}
							alt={subtask.assignee.name}
						/>
						<AvatarFallback className="text-[10px]">
							{subtask.assignee.initials}
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
