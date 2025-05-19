"use client";

import RegistrationForm from "@/components/auth/register/reigistration-form";
import RoleSelectionForm from "@/components/auth/register/role-selection-form";
import React, { useState } from "react";
import type { UserRole } from "../../../types/auth/auth-types";

const SignupPage = () => {
	const [step, setStep] = useState<1 | 2>(1);
	const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

	const handleRoleSelection = (role: UserRole) => {
		setSelectedRole(role);
	};

	const handleNextStep = () => {
		setStep(2);
	};

	return (
		<>
			{step === 1 && (
				<RoleSelectionForm
					onRoleSelection={handleRoleSelection}
					onNextStep={handleNextStep}
					selectedRole={selectedRole}
				/>
			)}

			{step === 2 && (
				<RegistrationForm selectedRole={selectedRole as UserRole} />
			)}
		</>
	);
};

export default SignupPage;
