import KanbanBoard from "@/components/dashboard/taskboard/kanban-board";
import TaskBoardFilterBar from "@/components/dashboard/taskboard/taskboard-filter-bar";
import TaskBoardHeader from "@/components/dashboard/taskboard/taskboard-header";
import { AppRoutePaths } from "@/config/routes-config";
import { staticTaskBoardData } from "@/lib/constants";
import type { UserRole } from "@/types/auth/auth-types";
import { redirect } from "next/navigation";
import { auth } from "../../../../../../../../../auth";

async function getProjectTaskBoardDetails(
	projectSlug: string,
	userId?: string,
	userRole?: UserRole,
) {
	// SIMULATE API CALL
	console.log(
		`Fetching task board data for project: ${projectSlug}, user: ${userId}, role: ${userRole}`,
	);

	return Promise.resolve({
		...staticTaskBoardData,
		projectName:
			staticTaskBoardData.tasks.length > 0
				? `Project for ${staticTaskBoardData.tasks[0].code.split("-")[0]}`
				: "Sample Project",
	});
}

export default async function ContractorTaskBoardPage(props: {
	params: Promise<{ projectSlug: string }>;
}) {
	const session = await auth();
	const userRole: UserRole = "Contractor";
	const params = await props.params;
	const projectSlug = params.projectSlug;

	if (!session?.user) {
		redirect(AppRoutePaths.SignIn);
	}

	if (session.user.role !== userRole) {
		console.warn(
			`Role mismatch: User role ${session.user.role} on Freelancer taskboard.`,
		);
		redirect(AppRoutePaths.FreelancerDashboard.Home);
	}

	const taskBoardDetails = await getProjectTaskBoardDetails(
		projectSlug,
		session.user.id,
		userRole,
	);

	if (!taskBoardDetails) {
		return <div>Project not found.</div>;
	}

	return (
		<div className="flex flex-col h-full max-h-screen overflow-hidden bg-transparent dark:bg-slate-900">
			<div className="p-4 flex-shrink-0">
				<TaskBoardHeader
					projectName={taskBoardDetails.projectName}
					projectSlug={projectSlug}
					userRole={userRole}
				/>
				<TaskBoardFilterBar />
			</div>
			<div className="flex-grow overflow-x-auto custom-scrollbar">
				<div className="h-full min-w-max flex">
					<KanbanBoard
						initialData={taskBoardDetails}
						userRole={userRole}
						projectSlug={projectSlug}
					/>
				</div>
			</div>
		</div>
	);
}
