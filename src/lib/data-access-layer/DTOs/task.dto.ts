import type { Expand } from "@/types";
import type {
	TaskAssignee,
	TaskPriority,
} from "@/types/dashboard/taskboard-types";
import type { ProjectMemberDTO, SingleProjectDTO } from "./project.dto";

export enum TaskStatus {
	IN_PROGRESS = "in_progress",
	IN_REVIEW = "in_review",
	DONE = "done",
	PENDING = "pending",
	CANCELLED = "cancelled",
	COMPLETED = "completed",
	BACKLOG = "backlog",
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
	assignee: Assignee | null;
	sub_tasks: SubtaskDTO[];
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
	members: ProjectMemberDTO[];
}

export interface SubtaskDTO {
	id: number;
	uuid: string;
	title: string;
	description: string;
	status: TaskStatus;
	priority: TaskPriority;
	assignee: Assignee;
	task_code: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	is_deleted: boolean;
	order: number;
	task: TaskDTO;
}

export type Assignee = Expand<
	Pick<TaskAssignee, "id" | "name"> & { email: string }
>;
