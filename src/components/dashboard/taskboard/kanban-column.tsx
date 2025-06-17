"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import type {
	KanbanColumnId,
	KanbanColumnType,
	Task,
} from "@/types/dashboard/taskboard-types";
import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusCircle, Search as SearchIcon } from "lucide-react";
import { useMemo } from "react";
import TaskCard from "./task-card";

interface KanbanColumnProps {
	column: KanbanColumnType;
	tasksInThisColumn: Task[];
	userRole: UserRole;
	projectSlug: string;
	onAddTask: (columnId: KanbanColumnId) => void;
	isActive?: boolean;
}

export default function KanbanColumn({
	column,
	tasksInThisColumn,
	userRole,
	projectSlug,
	onAddTask,
	isActive,
}: KanbanColumnProps) {
	const { setNodeRef, isOver } = useDroppable({
		id: column.id,
		data: { type: "Column", columnAccepts: ["Task"] },
	});

	const taskIds = useMemo(
		() => tasksInThisColumn.map((task) => task.id),
		[tasksInThisColumn],
	);

	return (
		<div
			ref={setNodeRef}
			className={cn(
				"flex flex-col w-60 md:w-[270px] lg:w-[290px] flex-shrink-0 bg-[#f9fafb] dark:bg-slate-800/50 rounded-lg h-screen",
				isActive ? "border-primary" : "",
				isOver
					? "ring-2 ring-primary ring-offset-2 ring-offset-background dark:ring-offset-slate-900 shadow-lg"
					: "shadow-sm",
			)}
		>
			<div className="p-3 px-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-[#f9fafb] dark:bg-slate-800/90 backdrop-blur-sm z-10 rounded-t-xl flex-shrink-0">
				<div className="flex justify-between items-center">
					<h3 className="font-semibold text-sm uppercase tracking-wider text-slate-600 dark:text-slate-300">
						{column.title}
					</h3>
					<span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
						{tasksInThisColumn.length}
					</span>
				</div>
			</div>

			{/* Scrollable Task Area */}
			<div className="flex-grow p-2 space-y-0 overflow-y-auto custom-scrollbar min-h-0 relative">
				{tasksInThisColumn.length === 0 && (
					<div
						className={cn(
							"absolute inset-0 min-h-[200px] rounded-lg transition-colors",
							isOver
								? "bg-primary/10 border-2 border-dashed border-primary"
								: "border-2 border-dashed border-transparent",
						)}
						style={{ minHeight: "calc(100% - 16px)" }}
					/>
				)}
				<SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
					{tasksInThisColumn.length > 0 ? (
						tasksInThisColumn.map((task) => (
							<TaskCard
								key={task.id}
								task={task}
								userRole={userRole}
								projectSlug={projectSlug}
							/>
						))
					) : (
						<div className="flex flex-grow items-center justify-center min-h-[80px] text-sm text-slate-400 dark:text-slate-500 p-4 text-center relative z-10">
							<div
								className={cn(
									"transition-all duration-200",
									isOver ? "text-primary font-medium" : "",
								)}
							>
								{isOver
									? "Drop task here"
									: 'Drag tasks here or click "Add task" below.'}
							</div>
						</div>
					)}
				</SortableContext>

				{column.id === "done" && (
					<Button
						variant="ghost"
						size="sm"
						className="w-full mt-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
					>
						<SearchIcon size={14} className="mr-2" />
						See older issues
					</Button>
				)}
			</div>

			<div className="p-2 border-t border-slate-200 dark:border-slate-700 mt-auto flex-shrink-0">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => onAddTask(column.id)}
					className="w-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
				>
					<PlusCircle size={16} className="mr-2" /> Add task
				</Button>
			</div>
		</div>
	);
}
