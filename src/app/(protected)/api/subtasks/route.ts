import { getSubtasksByTaskUuid } from "@/lib/data-access-layer/tasks.dal";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const taskUuid = searchParams.get("taskId");

	if (!taskUuid) {
		return NextResponse.json(
			{ message: "TaskId is required" },
			{ status: 400 },
		);
	}

	try {
		const subTasks = await getSubtasksByTaskUuid(taskUuid);
		return NextResponse.json(subTasks);
	} catch (error) {
		console.error(`API Error in /api/subtasks?taskId=${taskUuid}`);

		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		const status = message.includes("Authentication") ? 401 : 500;

		return NextResponse.json(
			{ message: `Failed to fetch tasks subtasks: ${message}` },
			{ status },
		);
	}
}
