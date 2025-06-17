"use client";

import {
	type Project,
	type ProjectMember,
	getProjectMembers,
	getProjects,
} from "@/actions/dashboard/projects.actions";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

interface ProjectContextType {
	projects: Project[];
	projectMembers: Record<string, ProjectMember[]>;
	isLoading: boolean;
	isError: boolean;
	error: string | null;
	refetchProjects: () => Promise<void>;
	refetchProjectMembers: (projectId: string) => Promise<void>;
	getProjectMembersById: (projectId: string) => ProjectMember[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [projectMembers, setProjectMembers] = useState<
		Record<string, ProjectMember[]>
	>({});
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProjects = async () => {
		try {
			setIsLoading(true);
			setIsError(false);
			setError(null);

			const result = await getProjects();

			if (result.success) {
				setProjects(result.data);

				for (const project of result.data) {
					await fetchProjectMembers(project.id);
				}
			} else {
				setIsError(true);
				setError(result.message || "Failed to fetch projects");
			}
		} catch (err) {
			setIsError(true);
			setError("An unexpected error occurred");
			console.error("Error fetching projects:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchProjectMembers = async (projectId: string) => {
		try {
			const result = await getProjectMembers(projectId);

			if (result.success && result.data.length > 0) {
				const projectData = result.data[0];
				setProjectMembers((prev) => ({
					...prev,
					[projectId]: projectData.members || [],
				}));
			}
		} catch (err) {
			console.error(`Error fetching members for project ${projectId}:`, err);
		}
	};

	const getProjectMembersById = (projectId: string): ProjectMember[] => {
		return projectMembers[projectId] || [];
	};

	const refetchProjects = async () => {
		await fetchProjects();
	};

	const refetchProjectMembers = async (projectId: string) => {
		await fetchProjectMembers(projectId);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchProjects();
	}, []);

	const value: ProjectContextType = {
		projects,
		projectMembers,
		isLoading,
		isError,
		error,
		refetchProjects,
		refetchProjectMembers,
		getProjectMembersById,
	};

	return (
		<ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
	);
}

export function useProjects() {
	const context = useContext(ProjectContext);
	if (context === undefined) {
		throw new Error("useProjects must be used within a ProjectProvider");
	}
	return context;
}
