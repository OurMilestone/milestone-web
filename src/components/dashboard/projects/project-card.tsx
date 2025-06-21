"use client";

import {
	deleteProjectAction,
	updateProjectAction,
} from "@/actions/dashboard/projects.actions";
import { EditProjectModal } from "@/components/modals/edit-project-modal";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppRoutePaths } from "@/config/routes-config";
import { queryKeys } from "@/lib/query/query-keys";
import type { UpdateProjectInput } from "@/lib/schemas/project-schema";
import { cn, getStatusBadgeVariant } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import type { UiProject } from "@/types/dashboard/projects-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	CheckCircle as CheckCircleIcon,
	Clock,
	Crown,
	DollarSign,
	Edit,
	Eye,
	MoreVertical,
	Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AddMemberModal } from "../../modals/add-member-modal";

interface ProjectCardProps {
	project: UiProject;
	userRole: UserRole;
	view: "overview" | "detail";
}

export function ProjectCard({ project, userRole, view }: ProjectCardProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

	const triggerRef = useRef<HTMLDivElement | null>(null);

	const statusInfo = getStatusBadgeVariant(
		project.status as
			| "On Track"
			| "At Risk"
			| "Off Track"
			| "Completed"
			| "Pending",
	);

	const { mutate: updateProject, isPending: isUpdating } = useMutation({
		mutationFn: (payload: {
			projectId: number;
			data: Partial<UpdateProjectInput & { status: string }>;
		}) => updateProjectAction(payload.projectId, payload.data),
		onSuccess: (res) => {
			if (res.success) {
				toast.success(res.message);
				queryClient.invalidateQueries({
					queryKey: queryKeys.projects.activeWithMembers,
				});
				setIsEditModalOpen(false);
			} else {
				toast.error(res.message);
			}
		},
		onError: (err) => toast.error(err.message),
	});

	const { mutate: deleteProject, isPending: isDeleting } = useMutation({
		mutationFn: (projectId: number) => deleteProjectAction(projectId),
		onSuccess: (res) => {
			if (res.success) {
				toast.success(res.message);
				queryClient.invalidateQueries({
					queryKey: queryKeys.projects.activeWithMembers,
				});

				setIsDeleteAlertOpen(false);
			} else {
				toast.error(res.message);
			}
		},
		onError: (err) => toast.error(err.message),
		onSettled: () => {
			setIsDeleteAlertOpen(false);
			document.body.focus();
		},
	});

	const handleViewProject = () => {
		const path =
			userRole === "Freelancer"
				? AppRoutePaths.FreelancerDashboard.Projects.Taskboard(project.id)
				: AppRoutePaths.ContractorDashboard.Projects.Taskboard(project.id);
		router.push(path);
	};

	const handleEditSubmit = (values: UpdateProjectInput) => {
		updateProject({ projectId: Number(project.id), data: values });
	};

	const handleMarkAsDone = () => {
		updateProject({
			projectId: Number(project.id),
			data: { status: "completed" },
		});
	};

	const handleDeleteConfirm = () => {
		deleteProject(Number(project.id));
	};

	const maxVisibleMembers = 4;
	const visibleMembers = (project.teamMembers ?? []).slice(
		0,
		maxVisibleMembers,
	);
	const hiddenMembersCount = Math.max(
		0,
		(project.teamMembers?.length ?? 0) - maxVisibleMembers,
	);

	const [durationValue, durationUnit] = project.duration.split(" ");

	return (
		<>
			<TooltipProvider>
				<Card
					className={cn(
						"overflow-hidden !shadow-none duration-300 ease-in-out h-full flex flex-col bg-white p-0",
					)}
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
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-7 w-7 text-muted-foreground hover:text-foreground"
											aria-label="More options"
											onClick={(e) => e.stopPropagation()}
										>
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										ref={triggerRef}
										onClick={(e) => e.stopPropagation()}
									>
										<DropdownMenuItem onSelect={handleViewProject}>
											<Eye className="mr-2 h-4 w-4" />
											<span>View Project</span>
										</DropdownMenuItem>

										{userRole === "Contractor" && (
											<>
												<DropdownMenuItem
													onSelect={() => setIsEditModalOpen(true)}
												>
													<Edit className="mr-2 h-4 w-4" />
													<span>Edit Project</span>
												</DropdownMenuItem>
												<DropdownMenuItem
													onSelect={handleMarkAsDone}
													disabled={isUpdating}
												>
													<CheckCircleIcon className="mr-2 h-4 w-4" />
													<span>Mark as Done</span>
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onSelect={() => setIsDeleteAlertOpen(true)}
													className="text-destructive focus:text-destructive focus:bg-destructive/10"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													<span>Delete Project</span>
												</DropdownMenuItem>
											</>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
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

							{view === "detail" && (
								<p className="text-sm text-muted-foreground line-clamp-3 mb-2">
									{project.description}
								</p>
							)}
							<hr className="my-3 border-border" />

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

							<div className="flex items-center justify-between mt-auto">
								<div className="flex -space-x-2 overflow-hidden items-center">
									{project.teamMembers && project.teamMembers.length > 0 ? (
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
																<Crown className="absolute -top-1 -left-1 h-4 w-6 text-yellow-500 fill-current z-10" />
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
										<p className="ml-2 text-xs text-muted-foreground italic">
											No members yet
										</p>
									)}
								</div>

								<div className="flex items-center gap-2">
									{userRole === "Contractor" && view === "detail" && (
										<AddMemberModal
											projectId={project.id}
											projectTitle={project.title}
										/>
									)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</TooltipProvider>

			{userRole === "Contractor" && (
				<>
					<EditProjectModal
						isOpen={isEditModalOpen}
						setIsOpen={setIsEditModalOpen}
						project={{
							id: Number(project.id),
							title: project.title,
							description: "This should be passed from the project prop",
							duration: Number.parseInt(durationValue, 10) || 0,
							duration_type: durationUnit || "months",
							budget: project.budget,
						}}
						onSubmit={handleEditSubmit}
						isSubmitting={isUpdating}
					/>
					<AlertDialog
						open={isDeleteAlertOpen}
						onOpenChange={(open) => {
							setIsDeleteAlertOpen(open);

							if (!open) {
								triggerRef.current?.focus();
							}
						}}
					>
						<AlertDialogContent className="bg-white shadow-none">
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the
									project "{project.title}".
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="bg-white">
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDeleteConfirm}
									disabled={isDeleting}
									className="bg-destructive hover:bg-destructive/90"
								>
									{isDeleting ? "Deleting..." : "Yes, delete project"}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			)}
		</>
	);
}
