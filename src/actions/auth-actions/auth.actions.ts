"use server";

import { apiClient } from "@/lib/api/api-client";
import type { ActionResult } from "@/types";
import type {
	ApiResponse,
	CreateAccountDao,
	CreateAccountDto,
	CreateSessionDao,
	CreateSessionDto,
	LoginFormData,
	RegisterFormData,
} from "@/types/auth/auth-types";
import axios from "axios";

function handleApiError(
	error: unknown,
	defaultMsg: string,
): ActionResult<null> {
	if (axios.isAxiosError(error)) {
		return {
			success: false,
			data: null,
			status: error?.status ?? 500,
			message: error?.response?.data.message ?? defaultMsg,
		};
	}
	return {
		success: false,
		data: null,
		status: 500,
		message: "An unexpected error occurred. Please try again later.",
	};
}

export const loginAction = async (
	formData: LoginFormData,
): Promise<ActionResult<CreateSessionDao | null>> => {
	try {
		const response = await apiClient.post<
			ApiResponse<CreateSessionDao>,
			CreateSessionDto
		>("/login-user", {
			email: formData.email,
			password: formData.password,
		});
		return {
			success: true,
			data: response.data.data,
			status: response.status,
			message: "Login successful",
		};
	} catch (error) {
		return handleApiError(error, "Login failed. Please try again.");
	}
};

export const registerAction = async (
	formData: RegisterFormData,
): Promise<ActionResult<CreateAccountDao | null>> => {
	try {
		const response = await apiClient.post<
			ApiResponse<CreateAccountDao>,
			CreateAccountDto
		>("/user/create", {
			full_name: formData.legalName,
			preferred_name: formData.preferredName,
			email: formData.email,
			password: formData.password,
			role: formData.role === "Freelancer" ? 1 : 2,
		});

		console.log("Registration response", { response });
		return {
			success: true,
			data: response.data.data,
			status: response.status,
			message: "Registration successful",
		};
	} catch (error) {
		return handleApiError(error, "Registration failed. Please try again.");
	}
};
