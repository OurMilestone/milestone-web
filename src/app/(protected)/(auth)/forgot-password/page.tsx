import ForgotPasswordForm from "@/components/auth/forgot-password/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Forgot Password | Milestone",
	description: "Forgot Password",
};

const ForgotPasswordPage = () => {
	return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
