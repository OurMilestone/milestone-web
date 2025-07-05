import { getTasksByProjectId } from "@/lib/data-access-layer/tasks.dal";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const projectIdStr = searchParams.get("projectId");

		if (!projectIdStr) {
			return NextResponse.json(
				{ message: "Project ID is required" },
				{ status: 400 },
			);
		}

		const projectId = Number.parseInt(projectIdStr);
		if (Number.isNaN(projectId)) {
			return NextResponse.json(
				{ message: "Invalid Project ID" },
				{ status: 400 },
			);
		}

		const tasks = await getTasksByProjectId(projectId);
		return NextResponse.json(tasks);
	} catch (error) {
		console.error("API Error in /api/tasks:", error);

		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		const status = message.includes("Authentication") ? 401 : 500;

		return NextResponse.json(
			{ message: `Failed to fetch project tasks: ${message}` },
			{ status },
		);
	}
}
