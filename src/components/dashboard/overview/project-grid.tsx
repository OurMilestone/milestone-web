"use client"; // This component has interactive elements (buttons)

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
import { PROJECTS_DATA, type Project } from "@/lib/constants";
import type { UserRole } from "@/types/auth/auth-types";
import {
	ChevronDown,
	ChevronRight,
	Filter,
	LayoutGrid,
	List,
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useMemo, useState } from "react";
import { ProjectCard } from "./project-card";

type ProjectStatusFilter = "All" | Project["status"];
type SortOption =
	| "title-asc"
	| "title-desc"
	| "budget-asc"
	| "budget-desc"
	| "status";

interface ProjectGridProps {
	userRole: UserRole;
	initialProjects?: Project[];
}

export function ProjectsGrid({
	userRole,
	initialProjects = PROJECTS_DATA,
}: ProjectGridProps) {
	const router = useRouter();
	const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("All");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortOption, setSortOption] = useState<SortOption>("title-asc");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	const filteredAndSortedProjects = useMemo(() => {
		let projects = initialProjects;

		if (statusFilter !== "All") {
			projects = projects.filter((p) => p.status === statusFilter);
		}

		if (searchTerm) {
			projects = projects.filter(
				(p) =>
					p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					p.company.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		}

		switch (sortOption) {
			case "title-asc":
				projects.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "title-desc":
				projects.sort((a, b) => b.title.localeCompare(a.title));
				break;
			case "budget-asc":
				projects.sort((a, b) => a.budget - b.budget);
				break;
			case "budget-desc":
				projects.sort((a, b) => b.budget - a.budget);
				break;
			case "status":
				projects.sort((a, b) => a.status.localeCompare(b.status));
				break;
		}
		return [...projects];
	}, [statusFilter, searchTerm, sortOption, initialProjects]);

	const projectStatuses: Project["status"][] = [
		"On Track",
		"Completed",
		"At Risk",
		"Off Track",
		"Pending",
	];

	const handleProjectCardClick = (projectTitle: string) => {
		let path = "";

		if (userRole === "Freelancer") {
			path = AppRoutePaths.FreelancerDashboard.Projects.Taskboard(projectTitle);
		} else if (userRole === "Contractor") {
			path = AppRoutePaths.ContractorDashboard.Projects.Taskboard(projectTitle);
		}
		if (path) {
			router.push(path);
		} else {
			console.warn(
				"Could not determine project taskboard path for role:",
				userRole,
			);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
				<h2 className="text-xl lg:text-2xl font-semibold text-foreground">
					Active Projects
				</h2>
				<div className="flex flex-wrap items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="gap-1.5 h-9">
								<Filter className="h-3.5 w-3.5" />
								{statusFilter === "All"
									? "Status: All"
									: `Status: ${statusFilter}`}
								<ChevronDown className="h-3.5 w-3.5 opacity-70" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => setStatusFilter("All")}>
								All
							</DropdownMenuItem>
							{projectStatuses.map((status) => (
								<DropdownMenuItem
									key={status}
									onClick={() => setStatusFilter(status)}
								>
									{status}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Sort By Dropdown */}
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

					{/* View Mode Toggle */}
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

					{/* View All Button - consider if this navigates to a dedicated projects page */}
					<Button
						variant="ghost"
						size="sm"
						className="gap-1 h-9 hidden sm:inline-flex"
					>
						View All
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{filteredAndSortedProjects.length > 0 ? (
				viewMode === "grid" ? (
					<div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
						{filteredAndSortedProjects.map((project) => (
							<ProjectCard
								key={project.id}
								project={project}
								onClick={() => handleProjectCardClick(project.title)}
							/>
						))}
					</div>
				) : (
					<div className="space-y-4">
						{/* Placeholder for List View */}
						{/* TODO: Implement List View Item Component */}
						{filteredAndSortedProjects.map((project) => (
							<div
								key={project.id}
								className="p-4 border rounded-md bg-white cursor-pointer hover:bg-background/30 hover:shadow-md transition-all"
								onClick={() => handleProjectCardClick(project.title)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ")
										handleProjectCardClick(project.title);
								}}
								tabIndex={0}
								// biome-ignore lint/a11y/useSemanticElements: <explanation>
								role="button"
								aria-label={`View project: ${project.title}`}
							>
								<h3 className="font-semibold">{project.title}</h3>
								<p className="text-sm text-muted-foreground">
									{project.company} - {project.status}
								</p>
							</div>
						))}
					</div>
				)
			) : (
				<div className="text-center py-12">
					<h3 className="text-xl font-medium text-muted-foreground">
						No projects found.
					</h3>
					<p className="text-sm text-muted-foreground mt-1">
						Try adjusting your filters or search term.
					</p>
					{/* Optional: Button to clear filters */}
					{(statusFilter !== "All" || searchTerm) && (
						<Button
							variant="outline"
							size="sm"
							className="mt-4"
							onClick={() => {
								setStatusFilter("All");
								setSearchTerm("");
							}}
						>
							Clear Filters
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
