import { getTransactionHistory } from "@/lib/data-access-layer/wallet.dal";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const transactions = await getTransactionHistory();
		return NextResponse.json(transactions);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}
