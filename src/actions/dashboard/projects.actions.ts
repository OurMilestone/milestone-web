"use server";

import { addMemberSchema } from "@/components/modals/add-member-modal";
import {
	deleteRequest,
	postRequest,
	putRequest,
} from "@/lib/api/server/api-client";
import { apiGet, apiPost } from "@/lib/api/server/server-api-client";
import type { ProjectDTO } from "@/lib/data-access-layer/DTOs/project.dto";
import { getProjectById } from "@/lib/data-access-layer/projects.dal";
import {
	type UpdateProjectInput,
	updateProjectSchema,
} from "@/lib/schemas/project-schema";
import { handleApiError } from "@/lib/utils";
import type { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";

export interface ProjectMember {
	id: string;
	email: string;
	role: string;
	full_name: string;
	preferred_name: string;
	is_verified: boolean;
	project_role: string;
}

import type { ProjectStatus } from "@/types/dashboard/projects-types";

export interface Project {
	id: string;
	title: string;
	description: string;
	duration: number;
	duration_type: "days" | "weeks" | "months";
	status: ProjectStatus;
	budget: number;
	created_at?: string;
	updated_at?: string;
}

export interface ProjectWithMembers {
	id: string;
	title: string;
	description: string;
	duration: number;
	duration_type: "days" | "weeks" | "months";
	status: ProjectStatus;
	budget: number;
	created_at?: string;
	updated_at?: string;
	members?: ProjectMember[];
}

export interface CreateProjectData {
	title: string;
	description: string;
	duration: number;
	duration_type: "days" | "weeks" | "months" | "years";
	status: ProjectStatus;
	budget: number;
}

export interface AddMemberData {
	user_email: string;
	role: "admin" | "member";
}
export async function createProject(data: CreateProjectData) {
	try {
		const response = await apiPost("/project/create/", data);

		if (response.success) {
			revalidatePath("/dashboard/contractor/overview");
			revalidatePath("/dashboard/contractor/projects");

			return {
				success: true,
				message: "Project created successfully",
				data: response.data,
			};
		}

		return {
			success: false,
			message: response.error || "Failed to create project",
		};
	} catch (error) {
		console.error("Error in createProject:", error);
		return {
			success: false,
			message: "An unexpected error occurred",
		};
	}
}

export async function getProjects() {
	try {
		const response = await apiGet<Project[]>("/project/all-projects/");

		return {
			success: response.success,
			data: response.data || [],
			message: response.error || response.message,
		};
	} catch (error) {
		console.error("Error in getProjects:", error);
		return {
			success: false,
			data: [],
			message: "Failed to fetch projects",
		};
	}
}

export async function getProject(id: string) {
	try {
		const response = await apiGet<Project>(`/project/${id}/get-project`);

		return {
			success: response.success,
			data: response.data || null,
			message: response.error || response.message,
		};
	} catch (error) {
		console.error("Error in getProject:", error);
		return {
			success: false,
			data: null,
			message: "Failed to fetch project",
		};
	}
}

export async function getProjectMembers(projectId: string) {
	try {
		const response = await apiGet<ProjectWithMembers[]>(
			`/project/${projectId}/get-project-members/`,
		);

		return {
			success: response.success,
			data: response.data || [],
			message: response.error || response.message,
		};
	} catch (error) {
		console.error("Error in getProjectMembers:", error);
		return {
			success: false,
			data: [],
			message: "Failed to fetch project members",
		};
	}
}

export async function addProjectMemberAction(
	projectId: number,
	input: AddMemberData,
): Promise<ActionResult<null>> {
	const session = await auth();

	if (session?.user?.role !== "Contractor") {
		return { success: false, status: 403, message: "Forbidden", data: null };
	}

	try {
		await postRequest(`/add-member/?project_id=${projectId}`, input, true);

		revalidatePath("/(dashboard)", "layout");

		return {
			success: true,
			data: null,
			status: 200,
			message: "Member invited successfully.",
		};
	} catch (error) {
		return handleApiError(error, "Failed to add member.");
	}
}

export async function updateProjectAction(
	projectId: number,
	payload: Partial<UpdateProjectInput & { status: ProjectStatus }>,
): Promise<ActionResult<ProjectDTO | null>> {
	const session = await auth();

	if (session?.user?.role !== "Contractor") {
		return {
			success: false,
			status: 403,
			message: "Forbidden",
			data: null,
		};
	}

	try {
		const currentProject = await getProjectById(projectId);

		if (!currentProject) {
			return {
				success: false,
				status: 404,
				message: "Project not found",
				data: null,
			};
		}

		if (!payload.status) {
			updateProjectSchema.parse(payload);
		}

		const finalApiPayload = {
			title: payload.title ?? currentProject.data?.title,
			description: payload.description ?? currentProject.data?.description,
			duration: payload.duration ?? currentProject.data?.duration,
			duration_type:
				payload.duration_type ?? currentProject.data?.duration_type,
			status: payload.status ?? currentProject.data?.status,
			budget: payload.budget ?? Number(currentProject.data?.budget),
		};

		const response = await putRequest<ProjectDTO, typeof payload>(
			`/project/${projectId}/update-project/`,
			finalApiPayload,
			true,
		);

		revalidatePath("/(dashboard)", "layout");

		return {
			success: true,
			data: response.data.data,
			status: 200,
			message: "Project updated successfully.",
		};
	} catch (error) {
		return handleApiError(error, "Failed to update project");
	}
}

export async function deleteProjectAction(
	projectId: number,
): Promise<ActionResult<null>> {
	const session = await auth();
	if (session?.user?.role !== "Contractor") {
		return { success: false, status: 403, message: "Forbidden", data: null };
	}

	try {
		await deleteRequest(`/project/${projectId}/delete-project/`, true);

		revalidatePath("/(dashboard)", "layout");

		return {
			success: true,
			data: null,
			status: 200,
			message: "Project deleted successfully.",
		};
	} catch (error) {
		return handleApiError(error, "Failed to delete project.");
	}
}
