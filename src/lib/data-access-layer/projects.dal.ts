import "server-only";

import type { ActionResult } from "@/types";
import { cache } from "react";
import { getRequest } from "../api/server/api-client";
import { handleApiError } from "../utils";
import type {
	ProjectDTO,
	ProjectMemberDTO,
	ProjectMembersDTO,
	ProjectStats,
	ProjectWithMembers,
	SingleProjectDTO,
} from "./DTOs/project.dto";
import { checkUserSession } from "./user-auth";

export const getProjectStats = cache(async (): Promise<ProjectStats> => {
	const allProjects = await getAllProjects();

	if (!allProjects || !allProjects.data || allProjects.data?.length === 0) {
		return { activeProjects: 0, completedProjects: 0 };
	}

	let activeCount = 0;
	let completedCount = 0;

	for (const project of allProjects.data) {
		const status = project.status.toLowerCase();

		if (status === "completed") {
			completedCount++;
		} else if (status !== "cancelled" && status !== "archived") {
			activeCount++;
		}
	}

	return {
		activeProjects: activeCount,
		completedProjects: completedCount,
	};
});

export const getAllProjects = cache(
	async (): Promise<ActionResult<ProjectDTO[] | null>> => {
		await checkUserSession();

		try {
			const response = await getRequest<ProjectDTO[]>(
				"/project/all-projects/",
				true,
			);

			if (!response.data?.data) {
				throw new Error("Invalid response format");
			}

			const projects = response.data.data.filter(
				(project) => !project.is_deleted,
			);

			return {
				success: true,
				data: projects,
				message: response.data.message,
				status: response.status,
			};
		} catch (error) {
			return handleApiError(error, "Failed to fetch all projects!");
		}
	},
);

export const getActiveProjects = cache(async (): Promise<ProjectDTO[]> => {
	const response = await getAllProjects();

	if (!response.success || response.data === null) {
		throw new Error(response.message);
	}

	const projects = response.data;

	return projects.filter(
		(project) =>
			project.status.toLowerCase() !== "completed" &&
			project.status.toLowerCase() !== "cancelled",
	);
});

export const getActiveProjectsWithMembers = cache(
	async (): Promise<ProjectWithMembers[]> => {
		const activeProjects = await getActiveProjects();

		if (!activeProjects || activeProjects.length === 0) {
			return [];
		}

		const memberPromises = activeProjects.map((project) =>
			getProjectMembers(project.id),
		);
		const memberResults = await Promise.all(memberPromises);

		const memberMap = new Map<number, ProjectMemberDTO[]>();

		for (const result of memberResults) {
			if (result.success && result.data) {
				memberMap.set(result.data.id, result.data.members);
			}
		}

		const projectsWithMembers = activeProjects.map((project) => ({
			...project,
			members: memberMap.get(project.id) || [],
		}));

		return projectsWithMembers;
	},
);

export const getProject = cache(
	async (projectId: number): Promise<ActionResult<SingleProjectDTO | null>> => {
		await checkUserSession();

		try {
			const response = await getRequest<SingleProjectDTO>(
				`/project/${projectId}/get-project`,
				true,
			);

			return {
				success: true,
				message: response.data.message,
				data: response.data.data,
				status: response.status,
			};
		} catch (error) {
			return handleApiError(error, "failed to fetch project!");
		}
	},
);

export const getProjectMembers = cache(
	async (
		projectId: number,
	): Promise<ActionResult<ProjectMembersDTO | null>> => {
		await checkUserSession();

		try {
			// biome-ignore lint/suspicious/noExplicitAny: any type is used here because the API response structure is not strictly defined
			const response = await getRequest<any>(
				`/project/${projectId}/get-project-members/`,
				true,
			);

			console.log("Project Members Response: ", response);
			const responseData = response.data.data;

			if (
				!responseData ||
				(responseData.message &&
					responseData.message === "No members found for this project") ||
				(Array.isArray(responseData) && responseData.length === 0)
			) {
				return {
					success: true,
					data: null,
					message: "No members found for this project",
					status: 200,
				};
			}

			const projectMembersData = responseData[0];

			return {
				success: true,
				data: projectMembersData,
				message: response.data.message,
				status: response.status,
			};
		} catch (error) {
			return handleApiError(error, "Failed to get project members!");
		}
	},
);
