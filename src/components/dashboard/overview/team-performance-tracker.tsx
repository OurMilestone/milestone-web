"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { AppRoutePaths } from "@/config/routes-config";
import { useActiveProjectsWithMembers } from "@/hooks/queries/use-projects";
import { cn, transformApiProjectToUiProject } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import type { ProjectStatus } from "@/types/dashboard/projects-types";
import { Filter, MoreHorizontal, Search } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useMemo, useState } from "react";
import { ProjectGridSkeleton } from "./project-grid-skeleton";

interface TeamPerformanceTrackerProps {
	userRole: UserRole;
}

function toProjectCode(id: string): string {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
	}
	let code = "";
	for (let i = 0; i < 8; i++) {
		code += alphabet[(hash + i * 17) % alphabet.length];
		hash = (hash * 13) >>> 0;
	}
	return code;
}

function statusLabel(status: ProjectStatus): string {
	switch (status) {
		case "in_progress":
			return "On-Going";
		case "pending":
			return "Hold";
		case "completed":
			return "Done";
		case "cancelled":
			return "Cancelled";
		default:
			return status;
	}
}

function statusClassName(status: ProjectStatus): string {
	switch (status) {
		case "in_progress":
			return "border-transparent bg-emerald-50 text-emerald-700";
		case "pending":
			return "border-transparent bg-amber-50 text-amber-700";
		case "completed":
			return "border-transparent bg-blue-50 text-blue-700";
		case "cancelled":
			return "border-transparent bg-rose-50 text-rose-700";
		default:
			return "";
	}
}

export function TeamPerformanceTracker({
	userRole,
}: TeamPerformanceTrackerProps) {
	const router = useRouter();
	const { data: apiProjectsWithMembers, isLoading } =
		useActiveProjectsWithMembers();
	const [searchTerm, setSearchTerm] = useState("");

	const projects = useMemo(() => {
		if (!apiProjectsWithMembers) return [];
		return apiProjectsWithMembers.map(transformApiProjectToUiProject);
	}, [apiProjectsWithMembers]);

	const filteredProjects = useMemo(() => {
		if (!searchTerm) return projects;
		const query = searchTerm.toLowerCase();
		return projects.filter(
			(project) =>
				project.title.toLowerCase().includes(query) ||
				project.company.toLowerCase().includes(query) ||
				toProjectCode(project.id).toLowerCase().includes(query),
		);
	}, [projects, searchTerm]);

	const openProject = (projectId: string) => {
		const path =
			userRole === "Freelancer"
				? AppRoutePaths.FreelancerDashboard.Projects.Taskboard(projectId)
				: AppRoutePaths.ContractorDashboard.Projects.Taskboard(projectId);
		router.push(path);
	};

	if (isLoading && !apiProjectsWithMembers) {
		return <ProjectGridSkeleton />;
	}

	return (
		<section className="rounded-xl border border-[#E8EAED] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-base font-semibold text-[#101828]">
						Team Performance Tracker
					</h2>
					<p className="mt-1 text-sm text-[#667085]">
						Monitor project status and team assignment.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-9 gap-1.5 rounded-lg border-[#E8EAED] text-[#344054]"
					>
						<Filter className="h-3.5 w-3.5" />
						Filter
					</Button>
					<div className="relative">
						<Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#98A2B3]" />
						<Input
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Search"
							className="h-9 w-[160px] rounded-lg border-[#E8EAED] bg-white pl-8 text-sm"
						/>
					</div>
				</div>
			</div>

			{filteredProjects.length === 0 ? (
				<div className="rounded-lg border border-dashed border-[#E8EAED] py-10 text-center">
					<p className="text-sm font-medium text-[#344054]">
						No projects to display
					</p>
					<p className="mt-1 text-xs text-[#98A2B3]">
						Active projects will appear here once available.
					</p>
				</div>
			) : (
				<div className="overflow-hidden rounded-lg border border-[#E8EAED]">
					<Table>
						<TableHeader>
							<TableRow className="bg-[#FAFBFC] hover:bg-[#FAFBFC]">
								<TableHead className="w-10 px-3">
									<span className="sr-only">Select</span>
								</TableHead>
								<TableHead className="px-3 text-xs font-medium text-[#667085]">
									Project ID
								</TableHead>
								<TableHead className="px-3 text-xs font-medium text-[#667085]">
									Project Name
								</TableHead>
								<TableHead className="px-3 text-xs font-medium text-[#667085]">
									Status
								</TableHead>
								<TableHead className="px-3 text-xs font-medium text-[#667085]">
									Member
								</TableHead>
								<TableHead className="w-12 px-3 text-xs font-medium text-[#667085]">
									Action
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredProjects.slice(0, 6).map((project) => (
								<TableRow
									key={project.id}
									className="cursor-pointer border-[#E8EAED]"
									onClick={() => openProject(project.id)}
								>
									<TableCell
										className="px-3"
										onClick={(event) => event.stopPropagation()}
									>
										<Checkbox aria-label={`Select ${project.title}`} />
									</TableCell>
									<TableCell className="px-3 font-mono text-xs text-[#667085]">
										{toProjectCode(project.id)}
									</TableCell>
									<TableCell className="px-3 text-sm font-medium text-[#101828]">
										{project.title}
									</TableCell>
									<TableCell className="px-3">
										<Badge
											variant="outline"
											className={cn(
												"rounded-full px-2.5 py-0.5 text-xs font-medium",
												statusClassName(project.status),
											)}
										>
											{statusLabel(project.status)}
										</Badge>
									</TableCell>
									<TableCell className="px-3">
										<div className="flex -space-x-2">
											{project.teamMembers.slice(0, 3).map((member) => (
												<Avatar
													key={`${project.id}-${member.name}`}
													className="h-7 w-7 border-2 border-white"
													title={member.name}
												>
													<AvatarFallback
														className={cn(
															"text-[10px] font-medium",
															member.color || "bg-slate-100 text-slate-700",
														)}
													>
														{member.initials}
													</AvatarFallback>
												</Avatar>
											))}
											{(project.totalMembers ?? project.teamMembers.length) >
												3 && (
												<Avatar className="h-7 w-7 border-2 border-white">
													<AvatarFallback className="bg-slate-100 text-[10px] font-medium text-slate-600">
														+
														{(project.totalMembers ??
															project.teamMembers.length) - 3}
													</AvatarFallback>
												</Avatar>
											)}
										</div>
									</TableCell>
									<TableCell
										className="px-3"
										onClick={(event) => event.stopPropagation()}
									>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-[#667085]"
												>
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Open actions</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() => openProject(project.id)}
												>
													Open taskboard
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</section>
	);
}
