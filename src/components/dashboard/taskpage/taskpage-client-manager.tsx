"use client";

import TaskDetailHeaderGlobal from "@/components/dashboard/taskpage/task-detail-header";
import TaskDetailLayout from "@/components/dashboard/taskpage/task-detail-layout";
import type { UserRole } from "@/types/auth/auth-types";
import type {
	ProjectTaskListItem,
	TaskDetail,
} from "@/types/dashboard/task-details-types";
import { useState } from "react";

interface TaskPageClientManagerProps {
	taskDetailsData: TaskDetail;
	projectTasksData: ProjectTaskListItem[];
	role: UserRole;
	projectSlug: string;
	taskId: string;
}

export default function TaskPageClientManager({
	taskDetailsData,
	projectTasksData,
	role,
	projectSlug,
	taskId,
}: TaskPageClientManagerProps) {
	const [isProjectListDrawerOpen, setIsProjectListDrawerOpen] = useState(false);
	const [isPinnedFieldsDrawerOpen, setIsPinnedFieldsDrawerOpen] =
		useState(false);

	const toggleProjectListDrawer = () => {
		setIsProjectListDrawerOpen((prev) => !prev);
	};

	const togglePinnedFieldsDrawer = () => {
		setIsPinnedFieldsDrawerOpen((prev) => !prev);
	};

	return (
		<div className="flex flex-col h-full min-h-screen">
			<div className="p-4 flex-shrink-0 bg-white  dark:bg-slate-900">
				<TaskDetailHeaderGlobal
					task={taskDetailsData}
					userRole={role}
					onToggleProjectList={toggleProjectListDrawer}
					onTogglePinnedFields={togglePinnedFieldsDrawer}
				/>
			</div>
			<div className="flex-grow">
				<TaskDetailLayout
					task={taskDetailsData}
					projectTasks={projectTasksData}
					currentRole={role}
					currentProjectSlug={projectSlug}
					currentTaskId={taskId}
					isProjectListDrawerOpen={isProjectListDrawerOpen}
					onProjectListDrawerOpenChange={setIsProjectListDrawerOpen}
					isPinnedFieldsDrawerOpen={isPinnedFieldsDrawerOpen}
					onPinnedFieldsDrawerOpenChange={setIsPinnedFieldsDrawerOpen}
				/>
			</div>
		</div>
	);
}
