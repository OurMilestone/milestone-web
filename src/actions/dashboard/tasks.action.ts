"use server";

import { AppRoutePaths } from "@/config/routes-config";
import { postRequest } from "@/lib/api/server/api-client";
import {
	type CreateTaskInput,
	createTaskSchema,
} from "@/lib/schemas/task-schema";
import { handleApiError } from "@/lib/utils";
import type { ActionResult } from "@/types";
import type { TaskDetail } from "@/types/dashboard/task-details-types";
import { revalidatePath } from "next/cache";
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
	projectSlug: string;
	// TODO: Add ordering information if the API supports it
}): Promise<ActionResult<null>> {
	// TODO: Add Zod validation for the input

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
		console.log(
			`Simulating API call: Update task ${input.taskId} to status ${input.newStatus}`,
		);

		if (Math.random() > 0.5) {
			return {
				success: false,
				status: 500,
				data: null,
				message: "Simulated server failure!",
			};
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));

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
