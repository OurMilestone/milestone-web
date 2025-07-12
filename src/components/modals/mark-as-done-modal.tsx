"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { AppRoutePaths } from "@/config/routes-config";
import type { UserRole } from "@/types/auth/auth-types";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { AwardsIcon } from "../../../public/assets/svgs/__index__";

interface MarkAsDoneModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	taskName: string;
	projectId: string;
	userRole: UserRole;
}

export default function MarkAsDoneModal({
	isOpen,
	onOpenChange,
	taskName,
	projectId,
	userRole,
}: MarkAsDoneModalProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const router = useRouter();

	const handleViewProject = () => {
		const taskboardPath =
			userRole === "Freelancer"
				? AppRoutePaths.FreelancerDashboard.Projects.Taskboard(projectId)
				: AppRoutePaths.ContractorDashboard.Projects.Taskboard(projectId);

		router.push(taskboardPath);
		onOpenChange(false);
	};

	const content = (
		<div className="text-center p-2 sm:p-4">
			<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-ful">
				<Image src={AwardsIcon} alt="Award Icon" className="h-12 w-11" />
			</div>
			<h3 className="mb-4 text-2xl font-semibold text-primary">
				Congratulations!
			</h3>
			<p className="mb-8 text-sm text-primary px-4">
				You've successfully completed "{taskName}"! Your hard work and
				dedication has paid off.
			</p>
			<div className="mb-8 text-center">
				<div className="flex items-center justify-center mb-1">
					<CircleCheck size={18} className="mr-2 text-primary flex-shrink-0" />
					<h4 className="font-medium text-primary">
						Project Milestone Reached
					</h4>
				</div>
				<p className="text-sm text-primary">
					Your professional profile has been updated with this achievement.
				</p>
			</div>
		</div>
	);

	if (isDesktop) {
		return (
			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-md p-0 bg-white">
					<DialogTitle />
					<DialogHeader className="p-6 pb-0" />
					{content}
					<DialogFooter className="flex-row justify-center gap-3 pb-8 pt-0 sm:justify-center">
						<Button
							onClick={handleViewProject}
							className=" bg-slate-800 hover:bg-slate-700 dark:bg-primary dark:hover:bg-primary/90 text-white"
						>
							View Project
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={isOpen} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader className="text-left sr-only">
					<DrawerTitle>Congratulations</DrawerTitle>
					<DrawerDescription>Task completed.</DrawerDescription>
				</DrawerHeader>
				<div className="mt-4">{content}</div>
				<DrawerFooter className="pt-2">
					<Button
						onClick={handleViewProject}
						className="w-full bg-slate-800 hover:bg-slate-700 dark:bg-primary dark:hover:bg-primary/90 text-white"
					>
						View Project
					</Button>
					<DrawerClose asChild>
						<Button variant="ghost" className="w-full">
							Close
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
