import RegisterBase from "@/components/auth/register/register-base";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Register | Milestone",
	description: "Get started on Milestone - Get paid for your work",
};

const RegisterPage = () => {
	return <RegisterBase />;
};

export default RegisterPage;
