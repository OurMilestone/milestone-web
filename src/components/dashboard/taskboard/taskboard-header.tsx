"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppRoutePaths } from "@/config/routes-config";
import type { UserRole } from "@/types/auth/auth-types";
import { Check, ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface TaskBoardHeaderProps {
	projectName: string;
	projectSlug: string;
	userRole: UserRole;
}

export default function TaskBoardHeader({
	projectName,
	projectSlug,
	userRole,
}: TaskBoardHeaderProps) {
	const projectsBasePath =
		userRole === "Freelancer"
			? AppRoutePaths.FreelancerDashboard.Projects.Home
			: AppRoutePaths.ContractorDashboard.Projects.Home;

	return (
		<div className="mb-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
				<div className="mb-4">
					<SidebarTrigger className="-ml-1" />
					<h1 className="text-2xl md:text-3xl font-semibold mb-2 text-slate-800 dark:text-slate-100">
						Project Overview
					</h1>
					<p className="text-sm text-slate-500 dark:text-slate-400">
						Track and manage all your tasks for this project in one place.
					</p>
				</div>
				<div className="flex items-center gap-2 flex-shrink-0">
					<Button className="bg-slate-800 hover:bg-slate-700 dark:bg-primary dark:hover:bg-primary/90 text-white">
						<Check size={16} className="mr-2" />
						Mark as Done
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="gap-1.5">
								Share <ChevronDown size={16} className="-mr-1 opacity-70" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>Copy Link</DropdownMenuItem>
							<DropdownMenuItem>Share via Email</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						variant="ghost"
						size="icon"
						className="text-slate-500 hover:text-slate-700"
					>
						<MoreHorizontal size={20} />
						<span className="sr-only">More options</span>
					</Button>
				</div>
			</div>

			{/* Breadcrumbs */}
			<div className="flex items-center text-sm text-slate-500 dark:text-slate-400 space-x-1.5">
				<Link
					href={projectsBasePath}
					className="hover:underline hover:text-primary"
				>
					Projects
				</Link>
				<ChevronRight size={14} />
				{/* 
				  // TODO: Link to project detail/overview page if it exists */}
				{/* <Link href={`${projectsBasePath}/${projectSlug}`} className="hover:underline hover:text-primary"> */}
				<span className="font-medium text-slate-700 dark:text-slate-200">
					{projectName}
				</span>
				{/* </Link> */}
				<ChevronRight size={14} />
				<span>Task Board</span>
			</div>
		</div>
	);
}
