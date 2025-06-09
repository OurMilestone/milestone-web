"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ProjectMemberAvatars } from "./project-members-avatars";
import { AddMemberModal } from "./add-member-modal";
import { useProjects } from "@/components/providers/project-provider";
import type { Project } from "@/actions/dashboard/projects.actions";
import { formatCurrency } from "@/utils/format-currency";

interface ProjectCardProps {
	project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
	const { getProjectMembersById } = useProjects();
	const members = getProjectMembersById(project.id);

	return (
		<Card>
			<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
				<div className="space-y-1">
					<CardTitle className="text-lg">{project.title}</CardTitle>
					<Badge
						variant={project.status === "pending" ? "secondary" : "default"}
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
