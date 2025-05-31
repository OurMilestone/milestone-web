"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import type { UserRole } from "@/types/auth/auth-types";
import type {
	ProjectTaskListItem,
	TaskDetail,
} from "@/types/dashboard/task-details-types";
import { Search } from "lucide-react";
import { useState } from "react";
import ProjectTaskList from "./project-task-list";
import TaskDetailSidebar from "./task-detail-sidebar";
import TaskDetailView from "./task-detail-view";

interface TaskDetailLayoutProps {
	task: TaskDetail;
	projectTasks: ProjectTaskListItem[];
	currentRole: UserRole;
	currentProjectSlug: string;
	currentTaskId: string;
	isProjectListDrawerOpen: boolean;
	onProjectListDrawerOpenChange: (isOpen: boolean) => void;
	isPinnedFieldsDrawerOpen: boolean;
	onPinnedFieldsDrawerOpenChange: (isOpen: boolean) => void;
}

export default function TaskDetailLayout({
	task,
	projectTasks,
	currentRole,
	currentProjectSlug,
	currentTaskId,
	isProjectListDrawerOpen,
	onProjectListDrawerOpenChange,
	isPinnedFieldsDrawerOpen,
	onPinnedFieldsDrawerOpenChange,
}: TaskDetailLayoutProps) {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredTasks = projectTasks.filter(
		(task) =>
			task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			task.code.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="flex h-full min-h-screen  dark:bg-slate-900">
			{/* Column 1: Far Left - Project Task List */}
			<aside className="w-60 md:w-72 lg:w-[280px] flex-shrink-0 h-full p-1 hidden lg:flex lg:flex-col">
				<div className="p-3 dark:bg-slate-800/50 z-50">
					<h2 className="text-sm font-semibold uppercase text-slate-600 mb-2 px-1">
						Tasks in Project
					</h2>
					<div className="relative">
						<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search board"
							className="pl-8 h-9 text-sm"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
				<ProjectTaskList
					tasks={filteredTasks}
					currentRole={currentRole}
					currentProjectSlug={currentProjectSlug}
					activeTaskId={currentTaskId}
				/>
			</aside>

			<Drawer
				open={isProjectListDrawerOpen}
				onOpenChange={onProjectListDrawerOpenChange}
				direction="right"
			>
				<DrawerContent className="lg:hidden w-[280px] p-0 h-full">
					<div className="flex flex-col h-full p-1">
						<div className="p-3 dark:bg-slate-800/50 z-50">
							<h2 className="text-sm font-semibold uppercase text-slate-600 mb-2 px-1">
								Tasks in Project
							</h2>
							<div className="relative">
								<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search board"
									className="pl-8 h-9 text-sm"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
						</div>
						<ProjectTaskList
							tasks={projectTasks}
							currentRole={currentRole}
							currentProjectSlug={currentProjectSlug}
							activeTaskId={currentTaskId}
						/>
					</div>
				</DrawerContent>
			</Drawer>

			{/* Column 2: Center - Main Task Details (Description, Subtasks, etc.) */}
			<main className="flex-1 overflow-y-auto custom-scrollbar p-4 min-w-0">
				<TaskDetailView task={task} />
			</main>

			{/* Column 3: Far Right - Pinned Fields / Task Properties Sidebar */}
			<aside className="w-72 md:w-80 lg:w-[300px] flex-shrink-0 p-1 hidden lg:block lg:mt-20">
				<TaskDetailSidebar task={task} userRole={currentRole} />
			</aside>
			<Drawer
				direction="right"
				open={isPinnedFieldsDrawerOpen}
				onOpenChange={onPinnedFieldsDrawerOpenChange}
			>
				<DrawerContent className="lg:hidden w-[340px] p-0 h-full">
					<div className="flex flex-col h-full p-3">
						<TaskDetailSidebar task={task} userRole={currentRole} />
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
