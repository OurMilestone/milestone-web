import { getUserWallet } from "@/lib/data-access-layer/wallet.dal";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const wallet = await getUserWallet();
		return NextResponse.json(wallet);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}
