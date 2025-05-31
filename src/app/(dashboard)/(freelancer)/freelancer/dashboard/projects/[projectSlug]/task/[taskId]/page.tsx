import TaskPageClientManager from "@/components/dashboard/taskpage/taskpage-client-manager";
import { AppRoutePaths } from "@/config/routes-config";
import { staticProjectTaskList, staticTaskDetailData } from "@/lib/constants";
import type { UserRole } from "@/types/auth/auth-types";
import type {
	ProjectTaskListItem,
	TaskDetail,
} from "@/types/dashboard/task-details-types";
import { redirect } from "next/navigation";
import { auth } from "../../../../../../../../../../auth";

// SIMULATE API CALLS
async function getTaskDetails(
	taskId: string,
	_projectSlug: string,
	_userId?: string,
	_userRole?: UserRole,
): Promise<TaskDetail | null> {
	console.log(
		`Fetching details for task: ${taskId} in project: ${_projectSlug}`,
	);
	// Fetch from our API based on taskId and projectSlug
	return Promise.resolve(staticTaskDetailData[taskId] || null);
}

async function getProjectTasks(
	projectSlug: string,
	_userId?: string,
	_userRole?: UserRole,
): Promise<ProjectTaskListItem[]> {
	console.log(`Fetching tasks for project sidebar: ${projectSlug}`);

	return Promise.resolve(staticProjectTaskList);
}

interface FreelancerTaskDetailPageProps {
	params: Promise<{
		projectSlug: string;
		taskId: string;
	}>;
}

export default async function FreelancerTaskDetailPage({
	params,
}: FreelancerTaskDetailPageProps) {
	const session = await auth();
	const { projectSlug, taskId } = await params;

	if (!session?.user) {
		redirect(AppRoutePaths.SignIn);
	}

	const [taskDetailsData, projectTasksData] = await Promise.all([
		getTaskDetails(taskId, projectSlug, session.user.id, session.user.role),
		getProjectTasks(projectSlug, session.user.id, session.user.role),
	]);

	if (!taskDetailsData) {
		const taskboardPath =
			session.user.role === "Freelancer"
				? AppRoutePaths.FreelancerDashboard.Projects.Taskboard(projectSlug)
				: AppRoutePaths.ContractorDashboard.Projects.Taskboard(projectSlug);
		redirect(taskboardPath);
		return null;
	}

	return (
		<TaskPageClientManager
			taskDetailsData={taskDetailsData}
			projectTasksData={projectTasksData}
			role={session.user.role}
			projectSlug={projectSlug}
			taskId={taskId}
		/>
	);
}
