"use client";

import { Button } from "@/components/ui/button";
import { tabs } from "@/config/constants";
import { AppRoutePaths } from "@/config/routes-config";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import { Check } from "lucide-react";
import Link from "next/link";

interface RoleSelectionFormProps {
	onRoleSelection: (role: UserRole) => void;
	onNextStep: () => void;
	selectedRole: UserRole | null;
}

const RoleSelectionForm = ({
	onRoleSelection,
	onNextStep,
	selectedRole,
}: RoleSelectionFormProps) => {
	return (
		<div className="w-full">
			<div className="mb-8">
				<h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#101828] sm:text-[1.9rem]">
					Create your account
				</h1>
				<p className="mt-2 text-[0.95rem] text-[#667085]">
					Choose how you&apos;ll use Milestone to get started.
				</p>
			</div>

			<div className="space-y-3">
				{tabs.map((tab) => {
					const selected = selectedRole === tab.role;
					const Icon = tab.icon;

					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => onRoleSelection(tab.role)}
							className={cn(
								"flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all sm:p-5",
								selected
									? "border-[#101828] bg-[#f9fafb] shadow-[0_1px_2px_rgb(16_24_40/0.05)]"
									: "border-[#eaecf0] bg-white hover:border-[#d0d5dd] hover:bg-[#fafafa]",
							)}
						>
							<span
								className={cn(
									"mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
									selected
										? "border-[#101828] bg-[#101828] text-white"
										: "border-[#eaecf0] bg-white text-[#667085]",
								)}
							>
								<Icon className="size-5" strokeWidth={1.75} />
							</span>

							<span className="min-w-0 flex-1">
								<span className="flex items-center justify-between gap-3">
									<span className="text-base font-semibold text-[#101828]">
										{tab.name}
									</span>
									<span
										className={cn(
											"flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
											selected
												? "border-[#101828] bg-[#101828] text-white"
												: "border-[#d0d5dd] bg-white",
										)}
									>
										{selected ? (
											<Check className="size-3" strokeWidth={3} />
										) : null}
									</span>
								</span>
								<span className="mt-1 block text-sm leading-relaxed text-[#667085]">
									{tab.description}
								</span>
							</span>
						</button>
					);
				})}
			</div>

			<Button
				className="mt-6 h-11 w-full rounded-lg bg-[#101828] text-sm font-semibold text-white hover:bg-black disabled:bg-[#d0d5dd] disabled:text-white"
				onClick={onNextStep}
				disabled={!selectedRole}
			>
				Continue
			</Button>

			<p className="mt-8 text-center text-sm text-[#667085]">
				Already have an account?{" "}
				<Link
					href={AppRoutePaths.SignIn}
					className="font-semibold text-[#101828] underline decoration-[#101828]/30 underline-offset-4 hover:decoration-[#101828]"
				>
					Log in
				</Link>
			</p>
		</div>
	);
};

export default RoleSelectionForm;
