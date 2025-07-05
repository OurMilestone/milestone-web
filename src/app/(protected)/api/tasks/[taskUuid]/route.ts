import { getTaskById } from "@/lib/data-access-layer/tasks.dal";
import { type NextRequest, NextResponse } from "next/server";

interface RouteContext {
	params: Promise<{
		taskUuid: string;
	}>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
	try {
		const task = await getTaskById((await params).taskUuid);

		if (!task) {
			return NextResponse.json({ message: "Task not found" }, { status: 404 });
		}
		return NextResponse.json(task);
	} catch (error) {
		console.error(`API Error in /api/tasks/${(await params).taskUuid}:`, error);

		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		const status = message.includes("Authentication") ? 401 : 500;

		return NextResponse.json(
			{ message: `Failed to fetch task: ${message}` },
			{ status },
		);
	}
}
