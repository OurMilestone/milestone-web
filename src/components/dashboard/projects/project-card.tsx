"use client";

import type { Project } from "@/actions/dashboard/projects.actions";
import { useProjects } from "@/components/providers/project-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format-currency";
import { MoreHorizontal } from "lucide-react";
import { getStatusBadgeVariant } from "../overview/project-card";
import { AddMemberModal } from "./add-member-modal";
import { ProjectMemberAvatars } from "./project-members-avatars";

interface ProjectCardProps {
	project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
	const { getProjectMembersById } = useProjects();
	const members = getProjectMembersById(project.id);
	const statusInfo = getStatusBadgeVariant(
		project.status[0].toUpperCase() + project.status.slice(1),
	);

	return (
		<Card className="bg-white shadow-none">
			<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
				<div className="space-y-1">
					<CardTitle className="text-lg">{project.title}</CardTitle>
					<Badge
						variant={statusInfo.variant}
						className={cn("text-xs px-2 py-0.5 mb-2", statusInfo.className)}
					>
						{project.status}
					</Badge>
					<CardDescription>
						{project.duration} {project.duration_type} • $
						{formatCurrency(project.budget)}
					</CardDescription>
				</div>
				<Button variant="ghost" size="sm">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-muted-foreground line-clamp-2">
					{project.description}
				</p>

				<div className="flex items-center justify-between">
					<ProjectMemberAvatars members={members} />

					<div className="flex items-center gap-3">
						<AddMemberModal
							projectId={project.id}
							projectTitle={project.title}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
