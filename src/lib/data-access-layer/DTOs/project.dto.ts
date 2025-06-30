import type { Expand } from "@/types";
import type { ProjectStatus } from "@/types/dashboard/projects-types";
import "server-only";

export type ProjectDurationType = "days" | "weeks" | "months";
export interface ProjectOwnerDTO {
	id: string;
	email: string;
	role: string;
	full_name: string;
	preferred_name: string;
	is_verified: boolean;
}

export interface ProjectMemberDTO extends ProjectOwnerDTO {
	project_role: string;
	username: string;
}

export interface ProjectDTO {
	id: number;
	title: string;
	description: string;
	duration: number;
	duration_type: ProjectDurationType;
	status: ProjectStatus;
	budget: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	deleted_at: string | null;
	owner: ProjectOwnerDTO;
}

export interface ProjectMembersDTO {
	id: number;
	title: string;
	members: ProjectMemberDTO[];
}

export type SingleProjectDTO = Expand<
	Omit<ProjectDTO, "owner"> & { owner: string; status: ProjectStatus }
>;

export interface ProjectWithMembers extends ProjectDTO {
	members: ProjectMemberDTO[];
}

export interface ProjectStats {
	activeProjects: number;
	completedProjects: number;
}
