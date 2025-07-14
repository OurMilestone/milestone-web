import { getTaskCommentsByTaskId } from "@/lib/data-access-layer/tasks.dal";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const taskIdString = searchParams.get("taskId");

	if (!taskIdString) {
		return NextResponse.json(
			{ message: "TaskId is required" },
			{ status: 400 },
		);
	}

	const taskId = Number.parseInt(taskIdString);

	if (Number.isNaN(taskId)) {
		return NextResponse.json(
			{ message: "Invalid project ID" },
			{ status: 400 },
		);
	}

	try {
		const taskComments = await getTaskCommentsByTaskId(taskId);
		return NextResponse.json(taskComments);
	} catch (error) {
		console.error(`API Error in /api/comments?taskId=${taskId}`);

		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		const status = message.includes("Authentication") ? 401 : 500;

		return NextResponse.json(
			{ message: `Failed to fetch tasks comments: ${message}` },
			{ status },
		);
	}
}
