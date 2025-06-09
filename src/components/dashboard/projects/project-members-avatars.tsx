"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ProjectMember } from "@/actions/dashboard/projects.actions";

interface ProjectMemberAvatarsProps {
	members: ProjectMember[];
	maxVisible?: number;
	size?: "sm" | "md" | "lg";
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function getAvatarColor(name: string): string {
	const colors = [
		"bg-red-100 text-red-700",
		"bg-blue-100 text-blue-700",
		"bg-green-100 text-green-700",
		"bg-yellow-100 text-yellow-700",
		"bg-purple-100 text-purple-700",
		"bg-pink-100 text-pink-700",
		"bg-indigo-100 text-indigo-700",
		"bg-orange-100 text-orange-700",
	];

	const hash = name
		.split("")
		.reduce((acc, char) => acc + char.charCodeAt(0), 0);
	return colors[hash % colors.length];
}

export function ProjectMemberAvatars({
	members,
	maxVisible = 4,
	size = "md",
}: ProjectMemberAvatarsProps) {
	const visibleMembers = members.slice(0, maxVisible);
	const remainingCount = Math.max(0, members.length - maxVisible);

	const sizeClasses = {
		sm: "h-6 w-6",
		md: "h-7 w-7 md:h-8 md:w-8",
		lg: "h-10 w-10",
	};

	const textSizeClasses = {
		sm: "text-xs",
		md: "text-xs",
		lg: "text-sm",
	};

	if (members.length === 0) {
		return (
			<div className="flex items-center text-sm text-muted-foreground">
				No members
			</div>
		);
	}

	return (
		<div className="flex -space-x-2 overflow-hidden">
			{visibleMembers.map((member, index) => {
				const initials = getInitials(member.preferred_name || member.full_name);
				const colorClass = getAvatarColor(member.full_name);

				return (
					<Avatar
						key={`${member.id}-${index}`}
						className={cn(
							sizeClasses[size],
							"border-2 border-card dark:border-background",
						)}
						title={`${member.full_name} (${member.project_role})`}
					>
						<AvatarFallback
							className={cn(colorClass, textSizeClasses[size], "font-medium")}
						>
							{initials}
						</AvatarFallback>
					</Avatar>
				);
			})}

			{remainingCount > 0 && (
				<Avatar
					className={cn(
						sizeClasses[size],
						"border-2 border-card dark:border-background",
					)}
					title={`+${remainingCount} more members`}
				>
					<AvatarFallback
						className={cn(
							"bg-gray-200 dark:bg-gray-700 text-slate-700 dark:text-slate-200",
							textSizeClasses[size],
							"font-medium",
						)}
					>
						+{remainingCount}
					</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
}
