"use client";

import { CreateProjectModal } from "@/components/dashboard/overview/create-project";
import { ProjectCard } from "@/components/dashboard/projects/project-card";
import { useProjects } from "@/components/providers/project-provider";
import SectionHeader from "@/components/typography/section-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContractorDashboardProjectsPage() {
	const { projects, isLoading, isError, error } = useProjects();

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
				{Array.from({ length: 6 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-3 w-1/2" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-3 w-full mb-2" />
							<Skeleton className="h-3 w-2/3" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<div className="text-center py-8">
				<p className="text-red-500">
					Error: {error || "Failed to load projects"}
				</p>
			</div>
		);
	}

	return (
		<div className="!mt-5 flex flex-col">
			<div className="flex items-center justify-between py-4">
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
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			)}
		</div>
	);
}
