import type {
	ProjectDTO,
	ProjectMembersDTO,
	ProjectWithMembers,
} from "@/lib/data-access-layer/DTOs/project.dto";
import type {
	TaskBoardPageData,
	TaskDTO,
} from "@/lib/data-access-layer/DTOs/task.dto";

class ClientApiError extends Error {
	constructor(
		message: string,
		public status: number,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		public response?: any,
	) {
		super(message);
		this.name = "ClientApiError";
	}
}

async function callApi<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	try {
		const response = await fetch(endpoint, {
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		});

		const data = await response.json();

		if (!response.ok) {
			throw new ClientApiError(
				data.message || `HTTP error! Status: ${response.status}`,
				data,
			);
		}

		return data as T;
	} catch (error) {
		if (error instanceof ClientApiError) {
			throw error;
		}
		console.error("Client API Request Error:", error);
		throw new ClientApiError(
			"A network error occurred. Please check your connection.",
			0,
		);
	}
}

export const clientApi = {
	/**
	 * Fetches all projects.
	 * Corresponds to `getAllProjects` in the DAL.
	 */
	getProjects: (): Promise<ProjectDTO[]> => {
		return callApi<ProjectDTO[]>("/api/projects");
	},

	/**
	 * Fetches only active projects.
	 * Corresponds to `getActiveProjects` in the DAL.
	 */
	getActiveProjects: (): Promise<ProjectDTO[]> => {
		return callApi<ProjectDTO[]>("/api/projects?type=active");
	},

	/**
	 * Fetches members for a specific project.
	 * Corresponds to `getProjectMembers` in the DAL.
	 * Note: The server returns ProjectMembersDTO, not an array.
	 */
	getProjectMembers: (projectId: number): Promise<ProjectMembersDTO | null> => {
		return callApi<ProjectMembersDTO | null>(
			`/api/projects/${projectId}/members`,
		);
	},

	/**
	 * Fetches active projects with their members.
	 * Corresponds to `getActiveProjectsWithMembers` in the DAL.
	 */
	getActiveProjectsWithMembers: (): Promise<ProjectWithMembers[]> => {
		return callApi<ProjectWithMembers[]>(
			"/api/projects?type=activeWithMembers",
		);
	},

	/**
	 * Retrieves tasks associated with a specific project.
	 *
	 * @param projectId - The unique identifier of the project for which tasks are to be fetched.
	 * @returns A promise that resolves to an array of TaskDTO objects representing the tasks of the specified project.
	 */
	getTasksByProjectId: (projectId: number): Promise<TaskDTO[]> => {
		return callApi<TaskDTO[]>(`/api/tasks?projectId=${projectId}`);
	},

	/**
	 * Retrieves a single task using its unique UUID.
	 *
	 * @param taskUuid - The unique identifier (UUID) of the task to be fetched.
	 * @returns A promise that resolves to a TaskDTO object if the task is found; otherwise, null.
	 */
	getTaskById: (taskUuid: string): Promise<TaskDTO | null> => {
		return callApi<TaskDTO | null>(`/api/tasks/${taskUuid}`);
	},

	/**
	 * Retrieves data for the task board of a specific project.
	 *
	 * @param projectId - The unique identifier of the project for which the task board data is to be fetched.
	 * @returns A promise that resolves to TaskBoardPageData containing the project, tasks, and members.
	 */
	getTaskBoardData: (projectId: number): Promise<TaskBoardPageData> => {
		return callApi<TaskBoardPageData>(`/api/taskboard/${projectId}`);
	},
};
