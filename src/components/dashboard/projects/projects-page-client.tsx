"use client";

import { CreateProjectModal } from "@/components/dashboard/overview/create-project";
import { ProjectGridSkeleton } from "@/components/dashboard/overview/project-grid-skeleton";
import SectionHeader from "@/components/typography/section-header";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAllProjectsWithMembers } from "@/hooks/queries/use-projects";
import { projectStatusSchema } from "@/lib/schemas/project-schema";
import {
	formatProjectStatus,
	transformApiProjectToUiProject,
} from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import type { ProjectStatus } from "@/types/dashboard/projects-types";
import { ChevronDown, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProjectCard } from "./project-card";

interface ProjectsPageClientProps {
	userRole: UserRole;
}

export function ProjectsPageClient({ userRole }: ProjectsPageClientProps) {
	const { data, isLoading, error } = useAllProjectsWithMembers();

	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortOption, setSortOption] = useState("title-asc");
	const [currentPage, setCurrentPage] = useState(1);
	const projectsPerPage = 9;

	const projects = useMemo(() => {
		if (!data) return [];
		return data.map(transformApiProjectToUiProject);
	}, [data]);

	const filteredAndSortedProjects = useMemo(() => {
		let filtered = projects;

		if (searchTerm) {
			filtered = filtered.filter(
				(p) =>
					p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					p.description.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		}

		if (statusFilter !== "all") {
			filtered = filtered.filter((p) => p.status === statusFilter);
		}

		switch (sortOption) {
			case "title-asc":
				filtered.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "title-desc":
				filtered.sort((a, b) => b.title.localeCompare(a.title));
				break;
			case "budget-asc":
				filtered.sort((a, b) => a.budget - b.budget);
				break;
			case "budget-desc":
				filtered.sort((a, b) => b.budget - a.budget);
				break;
		}

		return filtered;
	}, [projects, searchTerm, statusFilter, sortOption]);

	const paginatedProjects = useMemo(() => {
		const startIndex = (currentPage - 1) * projectsPerPage;
		return filteredAndSortedProjects.slice(
			startIndex,
			startIndex + projectsPerPage,
		);
	}, [filteredAndSortedProjects, currentPage]);

	const totalPages = Math.ceil(
		filteredAndSortedProjects.length / projectsPerPage,
	);

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
				{userRole === "Contractor" && (
					<div className="flex items-center gap-3">
						<CreateProjectModal />
					</div>
				)}
			</div>

			<div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
				<div className="relative w-full md:max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
					<Input
						placeholder="Search by title or description..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
				<div className="flex gap-2 flex-col md:flex-row">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="w-full md:w-auto">
								<Filter className="mr-2 h-4 w-4" />
								Status:{" "}
								{statusFilter === "all"
									? "All"
									: formatProjectStatus(statusFilter as ProjectStatus)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => setStatusFilter("all")}>
								All
							</DropdownMenuItem>
							{projectStatusSchema.options.map((status) => (
								<DropdownMenuItem
									key={status}
									onClick={() => setStatusFilter(status)}
								>
									{formatProjectStatus(status)}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="w-full md:w-auto">
								Sort by <ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
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
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{paginatedProjects.length === 0 ? (
				<div className="text-center py-14">
					<p className="text-muted-foreground">
						{projects.length === 0
							? "No projects found. Create your first project!"
							: "No projects match your filters. Try adjusting your filters or search term."}
					</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
					{paginatedProjects.map((project) => (
						<ProjectCard
							key={project.id}
							project={project}
							userRole={userRole}
							view="detail"
						/>
					))}
				</div>
			)}

			{totalPages > 1 && (
				<div className="flex justify-center items-center space-x-2 mt-8">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
					>
						Previous
					</Button>
					<span>
						Page {currentPage} of {totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							setCurrentPage((prev) => Math.min(prev + 1, totalPages))
						}
						disabled={currentPage === totalPages}
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
}
