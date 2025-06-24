"use server";

import { AppRoutePaths } from "@/config/routes-config";
import { patchRequest, postRequest } from "@/lib/api/server/api-client";
import type { TaskDTO } from "@/lib/data-access-layer/DTOs/task.dto";
import { getTaskById } from "@/lib/data-access-layer/tasks.dal";
import {
	type CreateTaskInput,
	createTaskSchema,
	updateTaskFieldSchema,
	updateTaskStatusSchema,
} from "@/lib/schemas/task-schema";
import { handleApiError, mapColumnIdToApiStatus } from "@/lib/utils";
import type { ActionResult } from "@/types";
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
	taskId: string;
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
			taskUuid: input.taskId,
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
			assignee: currentTask.assignee ? currentTask.assignee.id : null,
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
		const currentTask = await getTaskById(validatedInput.taskId);

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
			status: currentTask.status,
			label: validatedInput.fields.label ?? currentTask.label,
			assignee: validatedInput.fields.assignee ?? currentTask.assignee?.id,
			priority: validatedInput.fields.priority ?? currentTask.priority,
		};

		const response = await patchRequest<TaskDTO, typeof payload>(
			`/task/${validatedInput.taskId}/update-task/`,
			payload,
			true,
		);

		if (role === "Contractor") {
			revalidatePath(
				AppRoutePaths.ContractorDashboard.Projects.TaskDetail(
					currentTask.project.id.toString(),
					validatedInput.taskId,
				),
				"page",
			);
		} else {
			revalidatePath(
				AppRoutePaths.FreelancerDashboard.Projects.TaskDetail(
					currentTask.project.id.toString(),
					validatedInput.taskId,
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

// TODO: Implement create, update, delete subtask server actions
// For now, we will mock them to keep the focus on the main task mutations.
export async function createSubtaskAction(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	input: any,
): Promise<ActionResult<null>> {
	console.log("Simulating create subtask:", input);
	await new Promise((res) => setTimeout(res, 500));
	return {
		success: true,
		data: null,
		status: 201,
		message: "Subtask created.",
	};
}

export async function updateSubtaskAction(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	input: any,
): Promise<ActionResult<null>> {
	console.log("Simulating update subtask:", input);
	await new Promise((res) => setTimeout(res, 500));
	return {
		success: true,
		data: null,
		status: 200,
		message: "Subtask updated.",
	};
}
