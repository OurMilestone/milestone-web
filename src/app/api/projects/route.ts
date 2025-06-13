import {
	getActiveProjects,
	getActiveProjectsWithMembers,
	getAllProjects,
} from "@/lib/data-access-layer/projects.dal";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const type = searchParams.get("type") || "all";

		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let data;

		if (type === "activeWithMembers") {
			data = await getActiveProjectsWithMembers();
		} else if (type === "active") {
			data = await getActiveProjects();
		} else {
			data = await getAllProjects();
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("API Error in /api/projects:", error);

		const message =
			error instanceof Error ? error.message : "An unknown error occurred";

		const status = message.includes("Authentication") ? 401 : 500;

		return NextResponse.json(
			{ message: `Failed to fetch projects: ${message}` },
			{ status },
		);
	}
}
