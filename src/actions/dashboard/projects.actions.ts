"use server";

import { revalidatePath } from "next/cache";
import { apiGet, apiPost, apiPatch } from "@/lib/api/server-api-client";

export interface ProjectMember {
	id: string;
	email: string;
	role: string;
	full_name: string;
	preferred_name: string;
	is_verified: boolean;
	project_role: string;
}

export interface Project {
	id: string;
	title: string;
	description: string;
	duration: number;
	duration_type: "days" | "weeks" | "months";
	status: string;
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
	status: string;
	budget: number;
	created_at?: string;
	updated_at?: string;
	members?: ProjectMember[];
}

export interface CreateProjectData {
	title: string;
	description: string;
	duration: number;
	duration_type: "days" | "weeks" | "months";
	status: string;
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

export async function addProjectMember(
	projectId: string,
	memberData: AddMemberData,
) {
	try {
		const response = await apiPost(
			`/add-member/?project_id=${projectId}`,
			memberData,
		);

		if (response.success) {
			revalidatePath("/dashboard/contractor/overview");
			revalidatePath("/dashboard/contractor/projects");
			revalidatePath(`/dashboard/contractor/projects/${projectId}`);

			return {
				success: true,
				message: "Member added successfully",
				data: response.data,
			};
		}

		return {
			success: false,
			message: response.error || "Failed to add member",
		};
	} catch (error) {
		console.error("Error in addProjectMember:", error);
		return {
			success: false,
			message: "An unexpected error occurred",
		};
	}
}

export async function updateProjectStatus(id: string, status: string) {
	try {
		const response = await apiPatch(`/project/${id}/update-project`, {
			status,
		});

		if (response.success) {
			revalidatePath("/dashboard/contractor/overview");
			revalidatePath("/dashboard/contractor/projects");

			return {
				success: true,
				message: "Project status updated successfully",
				data: response.data,
			};
		}

		return {
			success: false,
			message: response.error || "Failed to update project status",
		};
	} catch (error) {
		console.error("Error in updateProjectStatus:", error);
		return {
			success: false,
			message: "An unexpected error occurred",
		};
	}
}

// export async function testProjectEndpoints() {
//   try {
//     const endpoints = [
//       "/project/all-projects/",
//       "/projects/",
//       "/project/",
//       "/api/projects/",
//       "/contractor/projects/",
//       "/user/projects/",
//     ]

//     const results = []

//     for (const endpoint of endpoints) {
//       console.log(`Testing endpoint: ${endpoint}`)
//       const response = await apiGet(endpoint)
//       results.push({
//         endpoint,
//         success: response.success,
//         error: response.error,
//         dataType: typeof response.data,
//         hasData: !!response.data,
//         statusHint: response.error?.includes("404")
//           ? "Not Found"
//           : response.error?.includes("403")
//             ? "Forbidden"
//             : response.error?.includes("401")
//               ? "Unauthorized"
//               : "Other",
//       })
//     }

//     return {
//       success: true,
//       results,
//     }
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error",
//     }
//   }
// }
