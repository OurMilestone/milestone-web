import { getSubtasksByTaskId } from "@/lib/data-access-layer/tasks.dal";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const taskIdStr = searchParams.get("taskId");

	if (!taskIdStr) {
		return NextResponse.json(
			{ message: "TaskId is required" },
			{ status: 400 },
		);
	}

	try {
		const taskId = Number.parseInt(taskIdStr);

		if (Number.isNaN(taskId)) {
			return NextResponse.json({ message: "Invalid Task ID" }, { status: 400 });
		}

		const subTasks = await getSubtasksByTaskId(taskId);
		return NextResponse.json(subTasks);
	} catch (error) {
		console.error(`API Error in /api/subtasks?taskId=${taskIdStr}`);

		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		const status = message.includes("Authentication") ? 401 : 500;

		return NextResponse.json(
			{ message: `Failed to fetch tasks subtasks: ${message}` },
			{ status },
		);
	}
}
