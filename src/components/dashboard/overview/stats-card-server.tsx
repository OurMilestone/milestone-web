import "server-only";

import { getProjectStats } from "@/lib/data-access-layer/projects.dal";
import type { UserRole } from "@/types/auth/auth-types";
import { StatsCards } from "./stats-card";

interface StatsCardsServerProps {
	userRole: UserRole;
}

export async function StatsCardsServer({ userRole }: StatsCardsServerProps) {
	const { activeProjects, completedProjects } = await getProjectStats();

	return (
		<StatsCards
			userRole={userRole}
			activeProjectsCount={activeProjects}
			completedProjectsCount={completedProjects}
		/>
	);
}
