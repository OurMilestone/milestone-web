import { resolveAccountNumber } from "@/lib/data-access-layer/paystack.dal";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const account_number = searchParams.get("account_number");
		const bank_code = searchParams.get("bank_code");

		if (!account_number || !bank_code) {
			return NextResponse.json(
				{
					success: false,
					message: "Account number and bank code are required",
				},
				{ status: 400 },
			);
		}

		const result = await resolveAccountNumber(account_number, bank_code);
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}
