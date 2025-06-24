"use client";

import { clientApi } from "@/lib/api/client/client-api";
import { getRequest } from "@/lib/api/server/api-client";
import type {
	ProjectDTO,
	ProjectMembersDTO,
	SingleProjectDTO,
} from "@/lib/data-access-layer/DTOs/project.dto";
import { queryKeys } from "@/lib/query/query-keys";
import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";

export function useActiveProjects() {
	return useQuery({
		queryKey: queryKeys.projects.active,
		queryFn: async () => {
			const response = await getRequest<ProjectDTO[]>(
				"/project/all-projects/",
				true,
			);

			if (!response.data?.data) {
				throw new Error("Invalid response format");
			}

			const allProjects = response.data.data.filter(
				(project) => !project.is_deleted,
			);
			return allProjects.filter(
				(project) =>
					project.status.toLowerCase() !== "completed" &&
					project.status.toLowerCase() !== "cancelled",
			);
		},
		placeholderData: keepPreviousData,
		throwOnError: false,
		staleTime: 10 * 60 * 1000,
	});
}

export function useProjects() {
	return useQuery({
		queryKey: queryKeys.projects.all,
		queryFn: () => clientApi.getProjects(),
		placeholderData: keepPreviousData,
		throwOnError: false,
		staleTime: 10 * 60 * 1000,
	});
}

export function useProjectById(projectId: number) {
	return useQuery({
		queryKey: queryKeys.projects.byProjectId(projectId),
		queryFn: async () => {
			const response = await getRequest<SingleProjectDTO>(
				`/project/${projectId}/get-project/`,
				true,
			);

			if (!response.data.data) {
				throw new Error("Invalid response format");
			}
		},
		placeholderData: keepPreviousData,
		throwOnError: false,
		staleTime: 10 * 60 * 1000,
	});
}

export function useProjectMembers(projectId: number) {
	return useQuery({
		queryKey: queryKeys.projectMembers.byProjectId(projectId),
		queryFn: () => clientApi.getProjectMembers(projectId),
		enabled: !!projectId,
		placeholderData: keepPreviousData,
		throwOnError: false,
		staleTime: 10 * 60 * 1000,
	});
}

export function useActiveProjectsWithMembers() {
	return useQuery({
		queryKey: queryKeys.projects.activeWithMembers,
		queryFn: clientApi.getActiveProjectsWithMembers,
		placeholderData: keepPreviousData,
		throwOnError: false,
		staleTime: 10 * 60 * 1000,
	});
}

export function useAllProjectsWithMembers() {
	return useQuery({
		queryKey: queryKeys.projects.allWithMembers,
		queryFn: () => clientApi.getAllProjectsWithMembers(),
		staleTime: 10 * 60 * 1000,
		placeholderData: keepPreviousData,
	});
}
