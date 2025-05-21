import LoginForm from "@/components/auth/login/login-form";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Login | Milestone",
	description: "Login to your account",
};

const Login = () => {
	return <LoginForm />;
};

export default Login;
