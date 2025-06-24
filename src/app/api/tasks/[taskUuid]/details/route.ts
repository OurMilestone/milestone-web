import { getTaskDetailPageData } from "@/lib/data-access-layer/tasks.dal";
import { type NextRequest, NextResponse } from "next/server";

interface RouteContext {
	params: Promise<{ taskUuid: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
	const { taskUuid } = await params;

	if (!taskUuid) {
		return NextResponse.json(
			{ message: "Task ID is required" },
			{ status: 400 },
		);
	}

	try {
		const { searchParams } = new URL(request.url);
		const projectIdString = searchParams.get("projectId");

		if (!projectIdString) {
			return NextResponse.json(
				{ message: "Project ID is required" },
				{ status: 400 },
			);
		}

		const projectId = Number.parseInt(projectIdString, 10);
		const data = await getTaskDetailPageData(projectId, taskUuid);

		return NextResponse.json(data);
	} catch (error) {
		console.error(`API Error in /api/tasks/${taskUuid}/details:`, error);

		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		const status = message.includes("Authentication") ? 401 : 500;

		return NextResponse.json(
			{ message: `Failed to fetch task details: ${message}` },
			{ status },
		);
	}
}
