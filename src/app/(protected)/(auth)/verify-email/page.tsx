import VerifyEmailForm from "@/components/auth/verify-email/verify-email-form";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Verify Email",
	description: "Verify your email",
};

const VerifyEmailPage = () => {
	return <VerifyEmailForm />;
};

export default VerifyEmailPage;
