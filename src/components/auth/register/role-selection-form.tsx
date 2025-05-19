import { tabs } from "@/config/constants";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import React from "react";
import SectionHeader from "../../typography/section-header";
import { Button } from "../../ui/button";

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
		<section className="flex flex-col items-center">
			<SectionHeader
				title="How would you use Milestone?"
				caption="Select your role and let&apos;s get you started."
				className="flex flex-col items-center mb-7"
			/>

			<div className="space-y-4 w-full max-w-md mb-8">
				{tabs.map((tab) => {
					return (
						<div
							key={tab.id}
							className={cn(
								"border-2 rounded-xl p-4 pb-5 cursor-pointer transition-all items-start flex gap-4 hover:border-primary",
								selectedRole === tab.role
									? "border-secondary bg-secondary/10"
									: "border-[#566384]/10",
							)}
							onClick={() => onRoleSelection(tab.role)}
							onKeyDown={() => onRoleSelection(tab.role)}
						>
							<div
								className={cn(
									"p-2 rounded-lg transition-colors",
									selectedRole === tab.role
										? "bg-secondary border-secondary"
										: "bg-transparent border border-[#566384]/40",
								)}
							>
								<tab.icon
									size={18}
									className={cn(
										selectedRole === tab.role
											? "text-white"
											: "text-[#566384]/40",
										"transition-colors",
									)}
								/>
							</div>

							<div>
								<p
									className={cn(
										"font-medium text-lg",
										selectedRole === tab.role
											? "text-secondary"
											: "text-[#566384]",
									)}
								>
									{tab.name}
								</p>

								<p
									className={cn(
										"text-sm max-w-xs leading-6 block",
										selectedRole === tab.role
											? "text-secondary"
											: "text-[#566384]",
									)}
								>
									{tab.description}
								</p>
							</div>
						</div>
					);
				})}

				<Button
					className="w-full h-11 max-w-md bg-primary hover:bg-primary/90 text-white cursor-pointer"
					onClick={onNextStep}
					disabled={!selectedRole}
				>
					Continue
				</Button>
			</div>
		</section>
	);
};

export default RoleSelectionForm;
