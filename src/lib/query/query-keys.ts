import type { UserRole } from "@/types/auth/auth-types";

export const queryKeys = {
	projects: {
		all: ["projects"] as const,
		allWithMembers: ["projects", "all", "with-members"] as const,
		active: ["projects", "active"] as const,
		activeWithMembers: ["projects", "active", "with-members"] as const,
		byRole: (role: UserRole) => ["projects", "role", role] as const,
		byProjectId: (projectId: number) => ["projects", projectId] as const,
	},

	projectMembers: {
		byProjectId: (projectId: number) => ["project-members", projectId] as const,
	},

	tasks: {
		byProjectId: (projectId: number) => ["tasks", projectId] as const,
		byTaskId: (taskUuid: string) => ["tasks", taskUuid] as const,
	},

	subtasks: {
		byTaskId: (taskUuid: string) => ["subtasks", "task", taskUuid] as const,
	},

	taskDetail: (taskUuid: string) => ["task", "detail", taskUuid] as const,
	taskComments: (taskUuid: number) => ["task", "comments", taskUuid] as const,
	taskComment: (commentUuid: string) =>
		["task", "comment", commentUuid] as const,

	wallet: ["user-wallet"] as const,

	transactions: {
		base: ["transactions"] as const,
	},

	banks: {
		list: ["banks"] as const,
	},
} as const;
