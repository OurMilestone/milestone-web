import type { ActionResult } from "@/types";
import type {
	KanbanColumnId,
	Task,
	TaskPriority,
} from "@/types/dashboard/taskboard-types";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApiResponse } from "./api/server/server-api-client";

import type {
	Transaction,
	TransactionStatus,
	TransactionType,
} from "@/types/dashboard/payments-types";
import type {
	ProjectStatus,
	UiProject,
} from "@/types/dashboard/projects-types";
import type {
	ProjectTaskListItem,
	Subtask,
	TaskDetail,
} from "@/types/dashboard/task-details-types";
import {
	AlertTriangle,
	CheckCircle,
	Clock,
	Loader2,
	XCircle,
} from "lucide-react";
import type { Project } from "./constants";
import type { ProjectWithMembers } from "./data-access-layer/DTOs/project.dto";
import {
	type SubtaskDTO,
	type TaskDTO,
	TaskStatus,
} from "./data-access-layer/DTOs/task.dto";
import type { TransactionDTO } from "./data-access-layer/DTOs/wallet.dto";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const nextAuthErrorMessagesMap: Record<string, string> = {
	CredentialsSignin: "Invalid email or password",
	Configuration: "Invalid email or password",
	OAuthSignin: "Unable to sign in with the selected provider.",
	OAuthCallback: "Unable to sign in with the selected provider.",
	OAuthCreateAccount: "Unable to create account with the selected provider.",
	EmailCreateAccount: "Unable to create account with email.",
	Callback: "An error occurred during sign in.",
	OAuthAccountNotLinked:
		"An account with this email already exists. Please sign in with the provider you used originally.",
	EmailSignin: "Unable to send sign-in email.",
	SessionRequired: "Please sign in to access this page.",
	AccessDenied: "You do not have permission to sign in.",
	Verification: "The verification link is invalid or has expired.",
	Default: "An unknown error occurred. Please try again.",
};

export const isValidCardNumber = (cardNumber: string): boolean => {
	let sum = 0;
	let shouldDouble = false;
	for (let i = cardNumber.length - 1; i >= 0; i--) {
		let digit = Number.parseInt(cardNumber.charAt(i));
		if (shouldDouble) {
			digit *= 2;
			if (digit > 9) {
				digit -= 9;
			}
		}
		sum += digit;
		shouldDouble = !shouldDouble;
	}
	return sum % 10 === 0;
};

export const generateMonthOptions = () => {
	return Array.from({ length: 12 }, (_, i) => {
		const month = (i + 1).toString().padStart(2, "0");
		return { value: month, label: month };
	});
};

export const generateYearOptions = (startYearOffset = 0, count = 10) => {
	const currentYear = new Date().getFullYear() + startYearOffset;

	return Array.from({ length: count }, (_, i) => {
		const year = (currentYear + i).toString();
		return { value: year, label: year };
	});
};

export const getInitials = (name?: string | null): string => {
	if (!name) return "?";

	return name
		.split(" ")
		.map((n) => n[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();
};

export const getUserColor = (userId: string): string => {
	const colors = [
		"bg-blue-200",
		"bg-green-200",
		"bg-purple-200",
		"bg-pink-200",
		"bg-yellow-200",
		"bg-indigo-200",
		"bg-red-200",
		"bg-cyan-200",
	];

	let hash = 0;

	for (let i = 0; i < userId?.length; i++) {
		hash = ((hash << 5) - hash + userId.charCodeAt(i)) & 0xffffffff;
	}
	return colors[Math.abs(hash) % colors.length];
};

export const formatCurrency = (
	amount: number,
	currency = "USD",
	locale = "en-US",
): string => {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
	}).format(amount);
};

export function handleApiError(
	error: unknown,
	defaultMsg: string,
): ActionResult<null> {
	console.warn("Auth Action Error:", error);

	if (axios.isAxiosError(error)) {
		const apiResponse = error.response?.data as ApiResponse<null>;

		return {
			success: false,
			data: null,
			status: error.response?.status ?? 500,
			message: apiResponse?.message ?? defaultMsg,
		};
	}
	return {
		success: false,
		data: null,
		status: 500,
		message:
			error instanceof Error
				? error.message
				: "An unexpected error occurred. Please try again later.",
	};
}

export const getStatusBadgeVariant = (
	status: ProjectStatus,
): {
	variant: "default" | "secondary" | "destructive" | "outline";
	className: string;
	icon?: React.ElementType;
} => {
	switch (status) {
		case "completed":
			return {
				variant: "default",
				className:
					"bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-600",
				icon: CheckCircle,
			};
		case "in_progress":
			return {
				variant: "secondary",
				className:
					"bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300 border-blue-300 dark:border-blue-600",
				icon: Loader2,
			};
		case "pending":
			return {
				variant: "outline",
				className:
					"bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600",
				icon: Clock,
			};
		case "cancelled":
			return {
				variant: "destructive",
				className:
					"bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-600",
				icon: XCircle,
			};
		default:
			return {
				variant: "secondary",
				className:
					"bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 border-gray-300 dark:border-gray-600",
			};
	}
};

/**Mappers */

export const mapApiStatusToColumnId = (status: string): KanbanColumnId => {
	const lowerStatus = status.toLowerCase();

	const normalizedStatus = lowerStatus.replace("-", "_");

	const validColumns: KanbanColumnId[] = [
		"backlog",
		"in_progress",
		"in_review",
		"done",
	];

	if (validColumns.includes(normalizedStatus as KanbanColumnId)) {
		return normalizedStatus as KanbanColumnId;
	}
	return "backlog";
};

export const mapColumnIdToApiStatus = (columnId: KanbanColumnId): string => {
	const statusMap: Record<KanbanColumnId, string> = {
		backlog: "BACKLOG",
		in_progress: "IN_PROGRESS",
		in_review: "IN_REVIEW",
		done: "DONE",
	};

	return statusMap[columnId] || "BACKLOG";
};

export function transformApiTaskToUiTask(
	apiTask: TaskDTO,
	index: number,
): Task {
	return {
		id: apiTask.uuid,
		title: apiTask.title,
		description: apiTask.description ?? "",
		columnId: mapApiStatusToColumnId(apiTask.status),
		code: apiTask.task_code,
		priority: apiTask.priority.toLowerCase() as TaskPriority,
		assignee: apiTask.assignee
			? {
					id: apiTask.assignee.id,
					name: apiTask.assignee.name,
					initials: getInitials(apiTask.assignee.name),
					email: apiTask.assignee.email,
				}
			: null,
		labels: apiTask.label
			? [
					{
						id: apiTask.label,
						name: apiTask.label,
						colorClasses:
							"bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300",
					},
				]
			: [],
		order: apiTask.order ?? index,
	};
}

export const mapProjectStatus = (status: string): ProjectStatus => {
	const lowerCaseStatus = status.toLowerCase();
	if (
		["pending", "in_progress", "completed", "cancelled"].includes(
			lowerCaseStatus,
		)
	) {
		return lowerCaseStatus as ProjectStatus;
	}
	return "pending";
};

export const formatProjectStatus = (status: ProjectStatus): string => {
	switch (status) {
		case "pending":
			return "Pending";
		case "in_progress":
			return "In Progress";
		case "completed":
			return "Completed";
		case "cancelled":
			return "Cancelled";
		default:
			return "Pending";
	}
};

export function transformApiProjectToUiProject(
	apiProject: ProjectWithMembers,
): UiProject {
	const teamMembers = [];

	teamMembers.push({
		initials:
			apiProject.owner &&
			(apiProject.owner.preferred_name || apiProject.owner.full_name)
				? getInitials(
						apiProject.owner.preferred_name || apiProject.owner.full_name,
					)
				: getInitials(""),
		color: getUserColor(apiProject.owner.id),
		name:
			apiProject.owner &&
			(apiProject.owner.preferred_name || apiProject.owner.full_name)
				? apiProject.owner.preferred_name || apiProject.owner.full_name
				: "Owner",
		isOwner: true,
	});

	// biome-ignore lint/complexity/noForEach: <explanation>
	apiProject.members
		.filter((member) => member.id !== apiProject.owner.id)
		.forEach((member) => {
			teamMembers.push({
				initials: getInitials(member.preferred_name || member.full_name),
				color: getUserColor(member.id),
				name: member.preferred_name || member.full_name,
				isOwner: false,
				role: member.project_role,
			});
		});

	return {
		id: apiProject.id.toString(),
		title: apiProject.title,
		description: apiProject.description,
		company: apiProject.owner.full_name || apiProject.owner.preferred_name,
		status: mapProjectStatus(apiProject.status),
		budget: Number.parseFloat(apiProject.budget),
		duration: `${apiProject.duration} ${apiProject.duration_type.slice(0, apiProject.duration_type.length - 1)}${apiProject.duration !== 1 ? "s" : ""}`,
		durationValue: apiProject.duration,
		durationUnit: apiProject.duration_type,
		teamMembers: teamMembers,
		image: "", // * Empty string for now as we do not have image upload functionality
		comments: 0, // * Using zero for now as API doesn't provide comments count
		totalMembers: teamMembers.length,
	};
}

export function transformApiSubtaskToUiSubtask(
	apiSubtask: SubtaskDTO,
): Subtask {
	return {
		id: apiSubtask.id.toString(),
		uuid: apiSubtask.uuid,
		title: apiSubtask.title,
		code: apiSubtask.task_code,
		description: apiSubtask.description,
		isCompleted: apiSubtask.status === TaskStatus.DONE,
		assignee: apiSubtask.assignee
			? {
					id: apiSubtask.assignee.id,
					name: apiSubtask.assignee.name,
					initials: getInitials(apiSubtask.assignee.name),
					email: apiSubtask.assignee.email,
				}
			: null,
		columnId: mapApiStatusToColumnId(apiSubtask.status),
		priority: apiSubtask.priority.toLowerCase() as TaskPriority,
		order: apiSubtask.order,
		createdAt: apiSubtask.created_at,
		updatedAt: apiSubtask.updated_at,
		deletedAt: apiSubtask.deleted_at,
		isDeleted: apiSubtask.is_deleted,
	};
}

export function transformApiTaskToUiTaskDetail(apiTask: TaskDTO): TaskDetail {
	return {
		id: Number(apiTask.id),
		uuid: apiTask.uuid,
		title: apiTask.title,
		project: {
			id: apiTask.project.id.toString(),
			name: apiTask.project.title,
			slug: apiTask.project.id.toString(),
		},
		columnId: mapApiStatusToColumnId(apiTask.status),
		code: apiTask.task_code,
		description: apiTask.description,
		labels: apiTask.label
			? [
					{
						id: apiTask.label,
						name: apiTask.label,
						colorClasses:
							"bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300",
					},
				]
			: [],
		priority: apiTask.priority.toLowerCase() as TaskPriority,
		assignee: apiTask.assignee
			? {
					id: apiTask.assignee.id,
					name: apiTask.assignee.name,
					initials: getInitials(apiTask.assignee.name),
					email: apiTask.assignee.email,
				}
			: null,
		reporter: apiTask.assignee
			? {
					id: apiTask.assignee.id,
					name: apiTask.assignee.name,
					initials: getInitials(apiTask.assignee.name),
					email: apiTask.assignee.email,
				}
			: null,
		subtasks: (apiTask.sub_tasks || []).map(transformApiSubtaskToUiSubtask),
		createdAt: apiTask.created_at,
		updatedAt: apiTask.updated_at,
	};
}

export function transformApiTaskToUiProjectTaskListItem(
	apiTask: TaskDTO,
): ProjectTaskListItem {
	return {
		id: apiTask.uuid.toString(),
		title: apiTask.title,
		code: apiTask.task_code,
		columnId: mapApiStatusToColumnId(apiTask.status),
		priority: apiTask.priority.toLowerCase() as TaskPriority,
		assignee: apiTask.assignee?.id
			? {
					initials: getInitials(apiTask.assignee.name),
				}
			: undefined,
	};
}

export const CURRENCY = "USD";

export const mapApiTransactionsToUITransaction = (
	transaction: TransactionDTO,
): Transaction => {
	return {
		id: transaction.id,
		amount: Number(transaction.amount),
		walletId: transaction.wallet,
		sender: transaction.sender,
		recipient: transaction.recipient,
		transactionDate: transaction.transaction_date,
		currency: CURRENCY,
		transactionReference: transaction.transaction_reference,
		transactionStatus:
			transaction.transaction_status as Lowercase<TransactionStatus>,
		transactionType: transaction.transaction_type as Lowercase<TransactionType>,
		transactionDescription: transaction.transaction_description,
	};
};
