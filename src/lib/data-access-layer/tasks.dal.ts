import "server-only";

import { cache } from "react";
import { getRequest } from "../api/server/api-client";
import type { TaskBoardPageData, TaskDTO } from "./DTOs/task.dto";
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
