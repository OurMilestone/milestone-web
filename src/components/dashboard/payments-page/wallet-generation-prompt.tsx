"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserRole } from "@/types/auth/auth-types";
import { Loader2, Wallet } from "lucide-react";

interface WalletGenerationPromptProps {
	userRole: UserRole;
	onGenerateWallet: () => void;
	isGenerating: boolean;
}

export default function WalletGenerationPrompt({
	userRole,
	onGenerateWallet,
	isGenerating,
}: WalletGenerationPromptProps) {
	const roleText = userRole === "Contractor" ? "contractor" : "freelancer";

	return (
		<div className="flex items-center justify-center">
			{/* Left side - Generation prompt */}
			<div className="">
				<Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-none bg-white">
					<CardContent className=" text-center">
						<h2 className="text-xl lg:text-2xl font-semibold text-slate-800 mb-4">
							Generate Your Personal Bank Account
						</h2>

						<p className="text-slate-600 mb-4 max-w-md mx-auto leading-relaxed">
							Create your dedicated virtual account to seamlessly manage
							payments, receive funds, and track your {roleText} finances in one
							secure location.
						</p>

						<Button
							onClick={onGenerateWallet}
							disabled={isGenerating}
							size="lg"
							className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-medium"
						>
							{isGenerating ? (
								<>
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
									Generating Account...
								</>
							) : (
								"Generate Account Now"
							)}
						</Button>

						<p className="text-sm text-slate-500 mt-4">
							Your account will be ready in seconds
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
