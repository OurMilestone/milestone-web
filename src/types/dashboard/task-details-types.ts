import type { Expand } from "..";
import type {
	KanbanColumnId,
	TaskAssignee,
	TaskLabel,
	TaskPriority,
} from "./taskboard-types";

export interface UserProfile {
	id: string;
	name: string;
	avatarUrl?: string;
	initials: string;
}

export interface Subtask {
	id: string;
	uuid: string;
	title: string;
	code: string;
	description: string;
	isCompleted: boolean;
	assignee: Expand<TaskAssignee> | null;
	columnId: KanbanColumnId;
	priority: TaskPriority;
	order: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	isDeleted: boolean;
}

export interface TaskDetail {
	id: number;
	uuid: string;
	title: string;
	project: {
		id: string;
		name: string;
		slug: string;
	};
	columnId: KanbanColumnId;
	code: string;
	description?: string;
	labels?: TaskLabel[];
	priority: TaskPriority;
	assignee: TaskAssignee | null;
	reporter: TaskAssignee | null;
	parentTask?: {
		id: string;
		title: string;
		code: string;
	};
	subtasks: Subtask[] | [];
	updateInterval?: string;
	client?: Expand<Pick<UserProfile, "id" | "name">>;
	otherCustomFields?: Record<string, unknown>; // *For future extensibility
	createdAt: string;
	updatedAt: string;
}

export type ProjectTaskListItem = Expand<
	Pick<Subtask, "id" | "code" | "title" | "columnId" | "priority"> & {
		assignee: Pick<TaskAssignee, "avatarUrl" | "initials"> | undefined;
	}
>;
