import type {
	ProjectDTO,
	ProjectMembersDTO,
	ProjectWithMembers,
} from "@/lib/data-access-layer/DTOs/project.dto";
import type {
	SubtaskDTO,
	TaskBoardPageData,
	TaskDTO,
	TaskDetailPageData,
} from "@/lib/data-access-layer/DTOs/task.dto";
import type {
	PaystackBankDTO,
	PaystackResolveDTO,
	WalletDTO,
} from "@/lib/data-access-layer/DTOs/wallet.dto";
import type { ActionResult } from "@/types";
import type {
	BankOption,
	Transaction,
	WalletAccount,
} from "@/types/dashboard/payments-types";
import type { Comment } from "@/types/dashboard/task-details-types";

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
	 * Corresponds to `getAllProjects` in the DAL (Data Access Layer).
	 */
	getProjects: (): Promise<ProjectDTO[]> => {
		return callApi<ProjectDTO[]>("/api/projects");
	},

	/**
	 * Fetches all projects with their members.
	 * Corresponds to `getAllProjectsWithMembers` in the DAL.
	 */
	getAllProjectsWithMembers: (): Promise<ProjectWithMembers[]> => {
		return callApi<ProjectWithMembers[]>("/api/projects?type=allWithMembers");
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
	getProjectMembers: async (
		projectId: number,
	): Promise<ProjectMembersDTO | null> => {
		const response = await callApi<{
			status: boolean;
			message: string;
			data: ProjectMembersDTO | null;
		}>(`/api/projects/${projectId}/members`);
		return response.data || null;
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

	/**
	 * Retrieves detailed data for a specific task within a project.
	 * @param projectId The unique identifier of the project to which the task belongs.
	 * @param taskId 	The unique identifier of the task for which details are to be fetched.
	 * @returns A promise that resolves to TaskDetailPageData containing the main task and related tasks.
	 * Corresponds to `getTaskDetailPageData` in the DAL.
	 * @throws ClientApiError if the API request fails or returns an error.
	 * @example
	 * ```typescript
	 * const taskDetail = await clientApi.getTaskDetailPageData(1, "task-uuid-123");
	 * ```
	 */
	getTaskDetailPageData: (
		projectId: number,
		taskId: string,
	): Promise<TaskDetailPageData> => {
		return callApi<TaskDetailPageData>(
			`/api/tasks/${taskId}/details?projectId=${projectId}`,
		);
	},

	/**
	 * Fetches the user's wallet.
	 */
	getWallet: (): Promise<ActionResult<WalletDTO>> => {
		return callApi<ActionResult<WalletDTO>>("/api/wallet");
	},

	/**
	 * Fetches the user's transaction history.
	 */
	getTransactions: (): Promise<ActionResult<Transaction[]>> => {
		return callApi<ActionResult<Transaction[]>>("/api/transactions");
	},

	/**
	 * Fetches a list of banks from Paystack.
	 */
	getBanks: (): Promise<ActionResult<PaystackBankDTO[]>> => {
		return callApi<ActionResult<PaystackBankDTO[]>>("/api/banks");
	},

	/**
	 * Resolves an account number to get account details.
	 */
	resolveAccountNumber: (
		account_number: string,
		bank_code: string,
	): Promise<ActionResult<PaystackResolveDTO | null>> => {
		return callApi<ActionResult<PaystackResolveDTO | null>>(
			`/api/resolve-account?account_number=${account_number}&bank_code=${bank_code}`,
		);
	},

	/**
	 * Retrieves subtasks associated with a specific task.
	 *
	 * @param taskUuid - The unique identifier of the task for which subtasks are to be fetched.
	 * @returns A promise that resolves to an array of SubtaskDTO objects representing the subtasks of the specified task.
	 */
	getSubtasksByTaskUuid: (taskUuid: string): Promise<SubtaskDTO[]> => {
		return callApi<SubtaskDTO[]>(`/api/subtasks?taskId=${taskUuid}`);
	},

	getTaskComments: async (taskUuid: string): Promise<Comment[]> => {
		const response = await callApi<Comment[]>(
			`/api/comment?taskId=${taskUuid}`,
		);
		return response || [];
	},
};
