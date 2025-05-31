export type KanbanColumnId =
	| "backlog"
	// | "selected_for_development"
	| "in_progress"
	| "in_review"
	| "done";

export interface KanbanColumnType {
	id: KanbanColumnId;
	title: string;
	taskCount?: number;
	totalTaskInState?: number;
}

export interface TaskAssignee {
	id: string;
	name: string;
	avatarUrl?: string;
	initials: string;
}

export interface TaskLabel {
	id: string;
	name: string;
	colorClasses: string;
}

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
	id: string;
	title: string;
	columnId: KanbanColumnId;
	code: string;
	labels?: TaskLabel[];
	priority: TaskPriority;
	assignees?: TaskAssignee[];
	order: number;
}

export interface ProjectTaskBoardData {
	projectId: string;
	projectName: string;
	columns: KanbanColumnType[];
	tasks: Task[];
}
