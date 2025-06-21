"use client";

import { CreateProjectModal } from "@/components/dashboard/overview/create-project";
import { ProjectGridSkeleton } from "@/components/dashboard/overview/project-grid-skeleton";
import SectionHeader from "@/components/typography/section-header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	useActiveProjectsWithMembers,
	useAllProjectsWithMembers,
} from "@/hooks/queries/use-projects";
import { transformApiProjectToUiProject } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import { useMemo } from "react";
import { ProjectCard } from "./project-card";

interface ProjectsPageClientProps {
	userRole: UserRole;
}

export function ProjectsPageClient({ userRole }: ProjectsPageClientProps) {
	const { data, isLoading, error } = useAllProjectsWithMembers();

	const projects = useMemo(() => {
		if (!data) return [];
		return data.map(transformApiProjectToUiProject);
	}, [data]);

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
				<ProjectGridSkeleton />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-500">
					Error: {error.message || "Failed to load projects"}
				</p>
			</div>
		);
	}

	return (
		<div className="!mt-5 flex flex-col px-2">
			<SidebarTrigger />
			<div className="flex items-center justify-between pt-2 pb-4">
				<SectionHeader
					title="Projects"
					caption="Track your active projects, milestones and payments"
					className="space-y-1"
				/>
				<div className="flex items-center gap-3">
					<CreateProjectModal />
				</div>
			</div>

			{projects.length === 0 ? (
				<div className="text-center py-14">
					<p className="text-muted-foreground">
						No projects found. Create your first project!
					</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
					{projects.map((project) => (
						<ProjectCard
							key={project.id}
							project={project}
							userRole={userRole}
							view="detail"
						/>
					))}
				</div>
			)}
		</div>
	);
}
