import "server-only";
import type { TaskPriority } from "@/types/dashboard/taskboard-types";
import type { ProjectMemberDTO, SingleProjectDTO } from "./project.dto";

export enum TaskStatus {
	IN_PROGRESS = "in_progress",
	IN_REVIEW = "in_review",
	DONE = "done",
	PENDING = "pending",
	CANCELLED = "cancelled",
	COMPLETED = "completed",
}

export interface TaskDTO {
	id: number;
	uuid: string;
	title: string;
	description: string;
	status: TaskStatus;
	label: string;
	priority: TaskPriority;
	task_code: string;
	project: {
		id: number;
		title: string;
		status: string;
	};
	assignee: {
		id: string;
		name: string;
		email: string;
	} | null;
	// biome-ignore lint/suspicious/noExplicitAny: Would be defined more strictly in the future when the API is stable
	sub_tasks: any[]; // Todo: Define more strictly when API is stable
	created_at: string;
	updated_at: string;
	order: number;
}

export interface TaskBoardPageData {
	project: SingleProjectDTO;
	tasks: TaskDTO[];
	members: ProjectMemberDTO[];
}

export interface TaskDetailPageData {
	mainTask: TaskDTO;
	projectTasks: TaskDTO[];
}
