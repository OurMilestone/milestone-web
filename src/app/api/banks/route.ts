import { listBanks } from "@/lib/data-access-layer/paystack.dal";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const banks = await listBanks();
		return NextResponse.json(banks);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}
