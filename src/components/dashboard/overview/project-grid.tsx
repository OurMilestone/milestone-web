"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppRoutePaths } from "@/config/routes-config";
import { useActiveProjectsWithMembers } from "@/hooks/queries/use-projects";
import type {
	ProjectDTO,
	ProjectMemberDTO,
} from "@/lib/data-access-layer/DTOs/project.dto";
import { queryKeys } from "@/lib/query/query-keys";
import { cn, transformApiProjectToUiProject } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import { useQueryClient } from "@tanstack/react-query";
import {
	AlertCircle,
	ChevronDown,
	ChevronRight,
	LayoutGrid,
	List,
	RefreshCw,
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useMemo, useState } from "react";
import { ProjectCard } from "../projects/project-card";
import { ProjectGridSkeleton } from "./project-grid-skeleton";

type SortOption =
	| "title-asc"
	| "title-desc"
	| "budget-asc"
	| "budget-desc"
	| "status";

interface ProjectGridProps {
	userRole: UserRole;
}

interface ProjectWithMembers extends ProjectDTO {
	members: ProjectMemberDTO[];
}

export function ProjectsGrid({ userRole }: ProjectGridProps) {
	const router = useRouter();

	const queryClient = useQueryClient();

	const {
		data: apiProjectsWithMembers,
		isLoading,
		error,
	} = useActiveProjectsWithMembers();

	const handleRefresh = () => {
		queryClient.invalidateQueries({
			queryKey: queryKeys.projects.activeWithMembers,
		});
	};

	const [searchTerm, setSearchTerm] = useState("");
	const [sortOption, setSortOption] = useState<SortOption>("title-asc");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	const projects = useMemo(() => {
		if (!apiProjectsWithMembers) return [];

		return apiProjectsWithMembers.map(transformApiProjectToUiProject);
	}, [apiProjectsWithMembers]);

	const filteredAndSortedProjects = useMemo(() => {
		let filteredProjects = projects;

		if (searchTerm) {
			filteredProjects = filteredProjects.filter(
				(p) =>
					p?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					p?.company.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		}

		switch (sortOption) {
			case "title-asc":
				filteredProjects.sort((a, b) =>
					(a?.title ?? "").localeCompare(b?.title ?? ""),
				);
				break;
			case "title-desc":
				filteredProjects.sort((a, b) =>
					(b?.title ?? "").localeCompare(a?.title ?? ""),
				);
				break;
			case "budget-asc":
				filteredProjects.sort((a, b) => (a?.budget ?? 0) - (b?.budget ?? 0));
				break;
			case "budget-desc":
				filteredProjects.sort((a, b) => (b?.budget ?? 0) - (a?.budget ?? 0));
				break;
			case "status":
				filteredProjects.sort((a, b) =>
					(a?.status ?? "").localeCompare(b?.status ?? ""),
				);
				break;
		}
		return [...filteredProjects];
	}, [projects, searchTerm, sortOption]);

	const handleProjectCardClick = (projectId: string) => {
		let path = "";

		if (userRole === "Freelancer") {
			path = AppRoutePaths.FreelancerDashboard.Projects.Taskboard(projectId);
		} else if (userRole === "Contractor") {
			path = AppRoutePaths.ContractorDashboard.Projects.Taskboard(projectId);
		}
		if (path) {
			router.push(path);
		}
	};

	const handleViewAllProjects = () => {
		const path =
			userRole === "Freelancer"
				? AppRoutePaths.FreelancerDashboard.Projects.Home
				: AppRoutePaths.ContractorDashboard.Projects.Home;
		router.push(path);
	};

	if (isLoading && !apiProjectsWithMembers) {
		return <ProjectGridSkeleton />;
	}

	const shouldShowError =
		error && (!apiProjectsWithMembers || apiProjectsWithMembers.length === 0);

	const hasProjects = projects && projects.length > 0;
	const hasFilteredProjects =
		filteredAndSortedProjects && filteredAndSortedProjects.length > 0;

	return (
		<div className="space-y-6">
			{error && apiProjectsWithMembers && apiProjectsWithMembers.length > 0 && (
				<Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
					<AlertCircle className="h-4 w-4 text-orange-600" />
					<AlertDescription className="text-orange-800 dark:text-orange-200">
						<div className="flex items-center justify-between">
							<span>Unable to fetch latest updates. Showing cached data.</span>
							<Button
								variant="outline"
								size="sm"
								onClick={handleRefresh}
								className="ml-2 h-7"
							>
								<RefreshCw className="h-3 w-3 mr-1" />
								Retry
							</Button>
						</div>
					</AlertDescription>
				</Alert>
			)}

			<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
				<h2 className="text-xl lg:text-2xl font-semibold text-foreground">
					Active Projects
				</h2>

				{projects.length > 0 && (
					<div className="flex flex-wrap items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="gap-1.5 h-9">
									Sort by
									<ChevronDown className="h-3.5 w-3.5 opacity-70" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Sort Options</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => setSortOption("title-asc")}>
									Title (A-Z)
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setSortOption("title-desc")}>
									Title (Z-A)
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setSortOption("budget-asc")}>
									Budget (Low-High)
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setSortOption("budget-desc")}>
									Budget (High-Low)
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setSortOption("status")}>
									Status
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<div className="flex items-center rounded-md border bg-background p-0.5">
							<Button
								variant={viewMode === "grid" ? "secondary" : "ghost"}
								size="sm"
								className="h-8 px-2.5"
								onClick={() => setViewMode("grid")}
								aria-label="Grid view"
							>
								<LayoutGrid className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "secondary" : "ghost"}
								size="sm"
								className="h-8 px-2.5"
								onClick={() => setViewMode("list")}
								aria-label="List view"
							>
								<List className="h-4 w-4" />
							</Button>
						</div>

						<Button
							variant="ghost"
							size="sm"
							className="gap-1 h-9 hidden sm:inline-flex"
							onClick={handleViewAllProjects}
						>
							View All
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				)}
			</div>

			{shouldShowError ? (
				<div className="text-center py-12">
					<h3 className="text-xl font-medium text-destructive">
						Failed to load projects
					</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Please check your connection and try again.
					</p>
					<Button
						variant="outline"
						size="sm"
						className="mt-4"
						onClick={handleRefresh}
					>
						<RefreshCw className="h-4 w-4 mr-2" />
						Try Again
					</Button>
				</div>
			) : hasFilteredProjects ? (
				viewMode === "grid" ? (
					<div
						className={cn(
							"grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4",
						)}
					>
						{filteredAndSortedProjects.map((project) => (
							<ProjectCard
								key={project?.id}
								project={project}
								userRole={userRole}
								view="overview"
							/>
						))}
					</div>
				) : (
					<div className="space-y-4">
						{filteredAndSortedProjects.map((project) => (
							<div
								key={project.id}
								className="p-4 border rounded-md bg-white cursor-pointer hover:bg-background/30 hover:shadow-md transition-all"
								onClick={() => handleProjectCardClick(project.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ")
										handleProjectCardClick(project.id);
								}}
								tabIndex={0}
								// biome-ignore lint/a11y/useSemanticElements: <explanation>
								role="button"
								aria-label={`View project: ${project.title}`}
							>
								<h3 className="font-semibold">{project.title}</h3>
								<p className="text-sm text-muted-foreground">
									{project.company} - {project.status} - {project.totalMembers}{" "}
									member{project.totalMembers !== 1 ? "s" : ""}
								</p>
							</div>
						))}
					</div>
				)
			) : hasProjects && !hasFilteredProjects ? (
				<div className="text-center py-12">
					<h3 className="text-xl font-medium text-muted-foreground">
						No projects match your filters
					</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Try adjusting your filters or search term.
					</p>
					<Button
						variant="outline"
						size="sm"
						className="mt-4"
						onClick={() => {
							setSearchTerm("");
						}}
					>
						Clear Filters
					</Button>
				</div>
			) : (
				<div className="text-center py-12">
					<h3 className="text-xl font-medium">No active projects</h3>
					<p className="mb-4 mt-2 text-sm text-muted-foreground">
						You currently do not have any active projects.
					</p>
					<Button onClick={handleViewAllProjects}>View all projects</Button>
				</div>
			)}
		</div>
	);
}
