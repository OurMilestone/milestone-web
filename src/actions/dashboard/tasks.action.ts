"use server";

import { AppRoutePaths } from "@/config/routes-config";
import {
	deleteRequest,
	patchRequest,
	postRequest,
} from "@/lib/api/server/api-client";
import type {
	SubtaskDTO,
	TaskDTO,
} from "@/lib/data-access-layer/DTOs/task.dto";
import {
	getTaskById,
	getTaskCommentsByTaskId,
} from "@/lib/data-access-layer/tasks.dal";
import {
	type CreateCommentInput,
	createCommentSchema,
} from "@/lib/schemas/task-schema";
import {
	type CreateSubtaskInput,
	type CreateTaskInput,
	createSubtaskSchema,
	createTaskSchema,
	updateTaskFieldSchema,
	updateTaskStatusSchema,
} from "@/lib/schemas/task-schema";
import { handleApiError, mapColumnIdToApiStatus } from "@/lib/utils";
import type { ActionResult, Expand } from "@/types";
import type { TaskDetail } from "@/types/dashboard/task-details-types";
import type { KanbanColumnId } from "@/types/dashboard/taskboard-types";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { auth } from "../../../auth";

export async function createTaskAction(
	input: CreateTaskInput,
): Promise<ActionResult<TaskDetail | null>> {
	const session = await auth();

	if (!session?.user) {
		return {
			success: false,
			status: 401,
			data: null,
			message: "Unauthorized",
		};
	}

	const role = session.user.role;

	try {
		const validatedInput = createTaskSchema.parse(input);

		console.log("Validated Input: ", validatedInput);

		const apiPayload = {
			project: validatedInput.projectId,
			title: validatedInput.title,
			description: validatedInput.description,
			assignee: validatedInput.assignee,
			status: validatedInput.status,
			priority: validatedInput.priority,
			label: validatedInput.label,
		};

		const response = await postRequest<TaskDetail, typeof apiPayload>(
			"/task/create/",
			apiPayload,
			true,
		);

		role === "Contractor"
			? revalidatePath(
					AppRoutePaths.ContractorDashboard.Projects.Taskboard(
						input.projectId.toString(),
					),
					"page",
				)
			: revalidatePath(
					AppRoutePaths.FreelancerDashboard.Projects.Taskboard(
						input.projectId.toString(),
					),
					"page",
				);

		return {
			success: true,
			data: response.data.data,
			status: response.status,
			message: "Task created successfully!",
		};
	} catch (error) {
		return handleApiError(error, "Failed to create task.");
	}
}

export async function updateTaskStatusAction(input: {
	taskUuid: string;
	newStatus: string;
	projectId: number;
}): Promise<ActionResult<null>> {
	const session = await auth();

	if (!session?.user) {
		return {
			success: false,
			status: 401,
			data: null,
			message: "Unauthorized",
		};
	}

	const role = session.user.role;

	try {
		const validatedInput = updateTaskStatusSchema.parse({
			taskUuid: input.taskUuid,
			newStatus: input.newStatus,
			projectId: input.projectId,
		});

		const currentTask = await getTaskById(validatedInput.taskUuid);

		if (!currentTask) {
			return {
				success: false,
				status: 404,
				data: null,
				message: "Task not found.",
			};
		}

		const apiStatus = mapColumnIdToApiStatus(
			validatedInput.newStatus as KanbanColumnId,
		);

		const payload = {
			project: currentTask.project.id,
			title: currentTask.title,
			description: currentTask.description,
			status: apiStatus,
			label: currentTask.label,
			assignee: currentTask.assignee?.id ? currentTask.assignee.id : undefined,
			priority: currentTask.priority,
		};

		const url = `/task/${validatedInput.taskUuid}/update-task/`;
		const response = await patchRequest<TaskDetail, typeof payload>(
			url,
			payload,
			true,
		);

		if (!response.data.status) {
			return {
				success: false,
				status: 400,
				data: null,
				message: response.data.message ?? "Failed to update task status.",
			};
		}

		role === "Contractor"
			? revalidatePath(
					AppRoutePaths.ContractorDashboard.Projects.Taskboard(
						input.projectId.toString(),
					),
					"page",
				)
			: revalidatePath(
					AppRoutePaths.FreelancerDashboard.Projects.Taskboard(
						input.projectId.toString(),
					),
					"page",
				);

		return {
			success: true,
			data: null,
			status: 200,
			message: "Task updated successfully.",
		};
	} catch (error) {
		return handleApiError(error, "Failed to update task.");
	}
}

export async function updateTaskFieldAction(
	input: z.infer<typeof updateTaskFieldSchema>,
): Promise<ActionResult<TaskDTO | null>> {
	const session = await auth();

	if (!session?.user) {
		return {
			success: false,
			status: 401,
			data: null,
			message: "Unauthorized",
		};
	}

	const role = session.user.role;

	try {
		const validatedInput = updateTaskFieldSchema.parse(input);
		const currentTask = await getTaskById(validatedInput.taskUuid);

		if (!currentTask) {
			return {
				success: false,
				status: 404,
				data: null,
				message: "Task not found.",
			};
		}

		const payload = {
			project: currentTask.project.id,
			title: validatedInput.fields.title ?? currentTask.title,
			description: validatedInput.fields.description ?? currentTask.description,
			status: validatedInput.fields.status ?? currentTask.status,
			label: validatedInput.fields.label ?? currentTask.label,
			assignee:
				validatedInput.fields.assignee ?? currentTask.assignee?.id ?? undefined,
			priority: validatedInput.fields.priority ?? currentTask.priority,
		};

		const response = await patchRequest<TaskDTO, typeof payload>(
			`/task/${validatedInput.taskUuid}/update-task/`,
			payload,
			true,
		);

		if (role === "Contractor") {
			revalidatePath(
				AppRoutePaths.ContractorDashboard.Projects.TaskDetail(
					currentTask.project.id.toString(),
					validatedInput.taskUuid,
				),
				"page",
			);
		} else {
			revalidatePath(
				AppRoutePaths.FreelancerDashboard.Projects.TaskDetail(
					currentTask.project.id.toString(),
					validatedInput.taskUuid,
				),
				"page",
			);
		}

		return {
			success: true,
			data: response.data.data,
			status: response.status,
			message: "Task updated successfully.",
		};
	} catch (error) {
		return handleApiError(error, "Failed to update task.");
	}
}

export async function createSubtaskAction(
	input: CreateSubtaskInput,
): Promise<ActionResult<SubtaskDTO | null>> {
	const session = await auth();

	if (!session?.user) {
		return {
			success: false,
			status: 401,
			data: null,
			message: "Unauthorized",
		};
	}

	const role = session.user.role;

	try {
		const validatedInput = createSubtaskSchema.parse(input);

		const apiPayload = {
			task: validatedInput.taskId,
			title: validatedInput.title,
			description: validatedInput.description,
			status: validatedInput.status,
			priority: validatedInput.priority,
		};

		const response = await postRequest<SubtaskDTO, typeof apiPayload>(
			"/subtask/create/",
			apiPayload,
			true,
		);

		const currentTask = await getTaskById(response.data.data.task.uuid);

		if (currentTask) {
			if (role === "Contractor") {
				revalidatePath(
					AppRoutePaths.ContractorDashboard.Projects.TaskDetail(
						currentTask.project.id.toString(),
						currentTask.uuid,
					),
					"page",
				);
			} else {
				revalidatePath(
					AppRoutePaths.FreelancerDashboard.Projects.TaskDetail(
						currentTask.project.id.toString(),
						currentTask.uuid,
					),
					"page",
				);
			}
		}

		return {
			success: true,
			data: response.data.data,
			status: response.status,
			message: "Subtask created successfully!",
		};
	} catch (error) {
		return handleApiError(error, "Failed to create subtask.");
	}
}

export async function updateSubtaskAction(
	subtaskUuid: string,
	data: Partial<CreateSubtaskInput>,
): Promise<ActionResult<SubtaskDTO | null>> {
	const session = await auth();

	if (!session?.user) {
		return {
			success: false,
			status: 401,
			data: null,
			message: "Unauthorized",
		};
	}

	const role = session.user.role;

	try {
		const response = await patchRequest<
			SubtaskDTO,
			Partial<CreateSubtaskInput>
		>(`/subtask/${subtaskUuid}/update-subtask/`, data, true);

		const taskUuid = response.data.data.task.uuid;
		const projectId = response.data.data.task.project.id;

		if (role === "Contractor") {
			revalidatePath(
				AppRoutePaths.ContractorDashboard.Projects.TaskDetail(
					projectId.toString(),
					taskUuid,
				),
				"page",
			);
		} else {
			revalidatePath(
				AppRoutePaths.FreelancerDashboard.Projects.TaskDetail(
					projectId.toString(),
					taskUuid,
				),
				"page",
			);
		}

		return {
			success: true,
			data: response.data.data,
			status: response.status,
			message: response.data.message ?? "Subtask updated successfully!",
		};
	} catch (error) {
		return handleApiError(error, "Failed to update subtask.");
	}
}

export async function deleteSubtaskAction(
	subtaskUuid: string,
): Promise<ActionResult<{ message: string } | null>> {
	const session = await auth();

	if (!session?.user) {
		return {
			success: false,
			status: 401,
			data: null,
			message: "Unauthorized",
		};
	}

	type DeleteDTO = { message: string };

	try {
		const response = await deleteRequest<DeleteDTO>(
			`/subtask/${subtaskUuid}/delete-subtask/`,
			true,
		);

		return {
			success: true,
			data: null,
			status: response.status,
			message: response.data.data.message ?? response.data.message,
		};
	} catch (error) {
		return handleApiError(error, "Failed to delete subtask.");
	}
}

export async function createCommentAction(
	input: CreateCommentInput,
): Promise<ActionResult<null>> {
	const session = await auth();

	if (!session?.user) {
		return {
			success: false,
			status: 401,
			data: null,
			message: "Unauthorized",
		};
	}

	try {
		const validatedInput = createCommentSchema.parse(input);

		const apiPayload = {
			task: validatedInput.task,
			subtask_id: validatedInput.subtask_id,
			content: validatedInput.content,
			mentions: validatedInput.mentions,
			parent: validatedInput.parent,
		};

		const response = await postRequest<null, typeof apiPayload>(
			"/comment/",
			apiPayload,
			true,
		);

		// Revalidate the task detail page to show the new comment
		// Note: We'll need to get the project ID from the task to revalidate properly
		// For now, we'll revalidate the task detail page
		revalidatePath("/dashboard/projects/*/task/*", "page");

		return {
			success: true,
			data: null,
			status: response.status,
			message: "Comment created successfully!",
		};
	} catch (error) {
		return handleApiError(error, "Failed to create comment.");
	}
}

export async function getTaskCommentsAction(taskId: number) {
	try {
		const comments = await getTaskCommentsByTaskId(taskId);
		return {
			success: true,
			data: comments,
			message: "Comments fetched successfully",
		};
	} catch (error) {
		return {
			success: false,
			data: [],
			message: "Failed to fetch comments",
		};
	}
}
