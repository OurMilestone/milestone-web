import { getProjectMembers } from "@/lib/data-access-layer/projects.dal";
import { type NextRequest, NextResponse } from "next/server";

interface RouteContext {
	params: Promise<{
		projectId: string;
	}>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
	try {
		const projectId = Number.parseInt((await params).projectId);

		if (Number.isNaN(projectId)) {
			return NextResponse.json(
				{ message: "Invalid project ID" },
				{ status: 400 },
			);
		}

		const projectMembers = await getProjectMembers(projectId);

		return NextResponse.json(projectMembers);
	} catch (error) {
		console.error(
			`API Error in /api/projects/${(await params).projectId}/members:`,
			error,
		);

		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		const status = message.includes("Authentication") ? 401 : 500;

		return NextResponse.json(
			{ message: `Failed to fetch project members: ${message}` },
			{ status },
		);
	}
}
