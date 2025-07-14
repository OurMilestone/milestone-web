import "server-only";

import { cache } from "react";
import { getRequest } from "../api/server/api-client";
import type { SubtaskDTO } from "./DTOs/task.dto";
import { checkUserSession } from "./user-auth";

export const getSubtasksByTaskId = cache(
	async (taskId: string): Promise<SubtaskDTO[]> => {
		await checkUserSession();

		try {
			const response = await getRequest<SubtaskDTO[]>(
				`/subtask?task_id=${taskId}`,
				true,
			);

			return response.data.data || [];
		} catch (error) {
			console.error(`DAL Error fetching subtasks for task ${taskId}:`, error);

			return [];
		}
	},
);
