import { getTaskBoardPageData } from "@/lib/data-access-layer/tasks.dal";
import { type NextRequest, NextResponse } from "next/server";

interface RouteContext {
	params: Promise<{ projectId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
	try {
		const { projectId: projectIdParam } = await params;
		const projectId = Number.parseInt(projectIdParam);

		if (Number.isNaN(projectId)) {
			return NextResponse.json(
				{ message: "Invalid Project ID" },
				{ status: 400 },
			);
		}

		const data = await getTaskBoardPageData(projectId);

		return NextResponse.json(data);
	} catch (error) {
		console.error(
			`API Error in /api/taskboard/${(await params).projectId}:`,
			error,
		);

		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		const status = message.includes("Authentication") ? 401 : 500;
		return NextResponse.json({ message }, { status });
	}
}
