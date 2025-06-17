"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppRoutePaths } from "@/config/routes-config";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import {
	AlertTriangle,
	CheckCircle,
	Clock,
	Crown,
	DollarSign,
	Loader2,
	MessageCircle,
	MoreVertical,
	XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";

interface TeamMember {
	initials: string;
	color: string;
	name?: string;
	isOwner?: boolean;
	role?: string;
}

interface Project {
	id: string;
	title: string;
	company: string;
	status: string;
	budget: number;
	duration: string;
	image?: string;
	teamMembers: TeamMember[];
	comments: number;
	totalMembers?: number;
}

interface ProjectCardProps {
	project: Project;
	userRole: UserRole;
}

export const getStatusBadgeVariant = (
	status: Project["status"],
): {
	variant: "default" | "secondary" | "destructive" | "outline";
	className: string;
	icon?: React.ElementType;
} => {
	switch (status) {
		case "Completed":
			return {
				variant: "default",
				className:
					"bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-600",
				icon: CheckCircle,
			};
		case "On Track":
			return {
				variant: "secondary",
				className:
					"bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300 border-blue-300 dark:border-blue-600",
				icon: Loader2,
			};
		case "Pending":
			return {
				variant: "outline",
				className:
					"bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600",
				icon: Clock,
			};
		case "At Risk":
			return {
				variant: "destructive",
				className:
					"bg-orange-100 text-orange-700 dark:bg-orange-700/30 dark:text-orange-300 border-orange-300 dark:border-orange-600",
				icon: AlertTriangle,
			};
		case "Off Track":
			return {
				variant: "destructive",
				className:
					"bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-600",
				icon: XCircle,
			};
		default:
			return {
				variant: "secondary",
				className:
					"bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 border-gray-300 dark:border-gray-600",
			};
	}
};

export function ProjectCard({ project, userRole }: ProjectCardProps) {
	const router = useRouter();

	const statusInfo = getStatusBadgeVariant(project.status);
	const StatusIcon = statusInfo.icon;

	const handleCardClick = () => {
		let path = "";

		const projectSlug = project.id;

		if (userRole === "Freelancer") {
			path = AppRoutePaths.FreelancerDashboard.Projects.Taskboard(projectSlug);
		} else if (userRole === "Contractor") {
			path = AppRoutePaths.ContractorDashboard.Projects.Taskboard(projectSlug);
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

	const handleRootClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (
			(e.target as HTMLElement).closest("button[aria-label='More options']")
		) {
			return;
		}
		handleCardClick();
	};

	const maxVisibleMembers = 4;
	const visibleMembers = project.teamMembers.slice(0, maxVisibleMembers);
	const hiddenMembersCount = Math.max(
		0,
		project.teamMembers.length - maxVisibleMembers,
	);

	return (
		<TooltipProvider>
			<Card
				className={cn(
					"overflow-hidden !shadow-none duration-300 ease-in-out h-full flex flex-col bg-white hover:bg-background/30 hover:shadow-md transition-all cursor-pointer",
				)}
				onClick={handleCardClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") handleCardClick();
				}}
				tabIndex={0}
				// biome-ignore lint/a11y/useSemanticElements: <explanation>
				role="button"
				aria-label={`View project: ${project.title}`}
			>
				<CardContent className="p-1.5 flex flex-col flex-grow">
					{project.image && (
						<div className="relative h-40 w-full flex-shrink-0">
							<Image
								src={project.image}
								alt={`Image for project: ${project.title}`}
								fill
								className="object-cover rounded-lg"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
						</div>
					)}

					<div className="p-4 flex flex-col flex-grow">
						<div className="flex items-start justify-between mb-2">
							<Badge
								variant={statusInfo.variant}
								className={cn("text-xs px-2 py-0.5", statusInfo.className)}
							>
								{project.status}
							</Badge>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 text-muted-foreground hover:text-foreground"
								aria-label="More options"
								// onClick={handleMoreOptionsClick}
							>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</div>
						<div className="space-y-1 mb-3 flex-grow">
							<h3
								className="font-semibold text-base md:text-lg text-foreground leading-tight truncate"
								title={project.title}
							>
								{project.title}
							</h3>
							<p
								className="text-xs md:text-sm text-muted-foreground truncate"
								title={project.company}
							>
								{project.company}
							</p>
						</div>

						<div className="flex items-center justify-between mb-3 text-xs md:text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<DollarSign className="h-3.5 w-3.5 md:h-4 md:w-4" />
								<span>{project.budget.toLocaleString()}</span>
							</div>
							<div className="flex items-center gap-1">
								<Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
								<span>{project.duration}</span>
							</div>
						</div>

						<hr className="my-3 border-border" />

						<div className="flex items-center justify-between mt-auto">
							<div className="flex -space-x-2 overflow-hidden">
								{project.teamMembers && project.teamMembers.length > 1 ? (
									<>
										{visibleMembers.map((member, index) => (
											<Tooltip key={`${member.initials}-${index}`}>
												<TooltipTrigger asChild>
													<div className="relative">
														<Avatar className="h-7 w-7 md:h-8 md:w-8 border-2 border-card dark:border-background">
															<AvatarFallback
																className={cn(
																	member.color,
																	"text-slate-700 dark:text-slate-200 text-xs font-medium",
																)}
															>
																{member.initials}
															</AvatarFallback>
														</Avatar>
														{member.isOwner && (
															<Crown className="absolute -top-1 -left-1 h-4 w-6 text-yellow-500 fill-current z-50" />
														)}
													</div>
												</TooltipTrigger>
												<TooltipContent side="top" className="text-sm">
													<div className="text-center">
														<p className="font-medium">
															{member.name || member.initials}
														</p>
														{member.isOwner && (
															<p className="text-xs text-muted-foreground">
																Project Owner
															</p>
														)}
														{member.role && !member.isOwner && (
															<p className="text-xs text-muted-foreground">
																{member.role}
															</p>
														)}
													</div>
												</TooltipContent>
											</Tooltip>
										))}

										{hiddenMembersCount > 0 && (
											<Tooltip>
												<TooltipTrigger asChild>
													<Avatar className="h-7 w-7 md:h-8 md:w-8 border-2 border-card dark:border-background">
														<AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-slate-700 dark:text-slate-200 text-xs font-medium">
															+{hiddenMembersCount}
														</AvatarFallback>
													</Avatar>
												</TooltipTrigger>
												<TooltipContent side="top" className="text-sm">
													<p>
														{hiddenMembersCount} more member
														{hiddenMembersCount !== 1 ? "s" : ""}
													</p>
												</TooltipContent>
											</Tooltip>
										)}
									</>
								) : (
									<div className="flex items-center">
										<Avatar className="h-7 w-7 md:h-8 md:w-8 border-2 border-card dark:border-background">
											<AvatarFallback
												className={cn(
													project.teamMembers[0]?.color,
													"text-slate-700 dark:text-slate-200 text-xs font-medium",
												)}
											>
												{project.teamMembers[0]?.initials}
											</AvatarFallback>
										</Avatar>
										<p className="ml-2 text-xs text-muted-foreground italic">
											No members yet
										</p>
									</div>
								)}
							</div>

							<div className="flex items-center gap-1 text-muted-foreground">
								<MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
								<span className="text-xs md:text-sm">{project.comments}</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</TooltipProvider>
	);
}
