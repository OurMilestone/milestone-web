import "server-only";

import type {
	Comment,
	CommentsResponse,
} from "@/types/dashboard/task-details-types";
import { cache } from "react";
import { getRequest } from "../api/server/api-client";
import type {
	SubtaskDTO,
	TaskBoardPageData,
	TaskDTO,
	TaskDetailPageData,
} from "./DTOs/task.dto";
import { getProjectById, getProjectMembers } from "./projects.dal";
import { checkUserSession } from "./user-auth";

export const getTasksByProjectId = cache(
	async (projectId: number): Promise<TaskDTO[]> => {
		await checkUserSession();

		try {
			const response = await getRequest<TaskDTO[]>(
				`/task/${projectId}/get-tasks/`,
				true,
			);

			return response.data.data || [];
		} catch (error) {
			console.error(
				`DAL Error fetching tasks for project ${projectId}:`,
				error,
			);

			return [];
		}
	},
);

export const getTaskById = cache(
	async (taskUuid: string): Promise<TaskDTO | null> => {
		await checkUserSession();

		try {
			const response = await getRequest<TaskDTO>(
				`/task/${taskUuid}/retrieve-task/`,
				true,
			);

			return response.data.data;
		} catch (error) {
			console.error(`DAL Error fetching task ${taskUuid}:`, error);
			return null;
		}
	},
);

export const getTaskBoardPageData = cache(
	async (projectId: number): Promise<TaskBoardPageData> => {
		const [project, tasks, membersResult] = await Promise.all([
			getProjectById(projectId),
			getTasksByProjectId(projectId),
			getProjectMembers(projectId),
		]);

		if (!project || !project.data) {
			throw new Error(`Project with ID ${projectId} not found.`);
		}

		return {
			project: project.data,
			tasks,
			members: membersResult?.success ? membersResult.data?.members || [] : [],
		};
	},
);

export const getTaskDetailPageData = cache(
	async (projectId: number, taskUuid: string): Promise<TaskDetailPageData> => {
		const [mainTask, projectTasks, membersResult] = await Promise.all([
			getTaskById(taskUuid),
			getTasksByProjectId(projectId),
			getProjectMembers(projectId),
		]);

		if (!mainTask) {
			throw new Error(`Task with UUID ${taskUuid} not found.`);
		}

		return {
			mainTask,
			projectTasks,
			members: membersResult?.success ? membersResult.data?.members || [] : [],
		};
	},
);

export const getSubtasksByTaskUuid = cache(
	async (taskUuid: string): Promise<SubtaskDTO[]> => {
		await checkUserSession();

		try {
			const response = await getRequest<SubtaskDTO[]>(
				`/subtask/${taskUuid}/get-subtasks/`,
				true,
			);

			return response.data.data || [];
		} catch (error) {
			console.error(`DAL Error fetching subtasks for task ${taskUuid}:`, error);

			return [];
		}
	},
);

export const getTaskCommentsByTaskUuid = cache(
	async (taskUuid: string): Promise<Comment[]> => {
		await checkUserSession();

		try {
			const response = await getRequest<Comment[]>(
				`/comment/get-all-comments?task=${taskUuid}`,
				true,
			);

			return response.data.data || [];
		} catch (error) {
			console.error(`DAL Error fetching comments for task ${taskUuid}:`, error);

			return [];
		}
	},
);
