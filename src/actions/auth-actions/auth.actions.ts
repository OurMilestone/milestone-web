"use server";

import { postRequest } from "@/lib/api/api-client";
import type { ActionResult } from "@/types";
import type {
	ApiResponse,
	CreateAccountDao,
	CreateAccountDto,
	CreateSessionDao,
	CreateSessionDto,
	LoginFormData,
	RegisterFormData,
	ResendEmailOTPDao,
	ResendEmailOTPDto,
	VerifyEmailOTPDao,
	VerifyEmailOTPDto,
} from "@/types/auth/auth-types";
import axios from "axios";

function handleApiError(
	error: unknown,
	defaultMsg: string,
): ActionResult<null> {
	console.error("Auth Action Error:", error);

	if (axios.isAxiosError(error)) {
		const apiResponse = error.response?.data as ApiResponse<null>;

		return {
			success: false,
			data: null,
			status: error.response?.status ?? 500,
			message: apiResponse?.message ?? defaultMsg,
		};
	}
	return {
		success: false,
		data: null,
		status: 500,
		message:
			error instanceof Error
				? error.message
				: "An unexpected error occurred. Please try again later.",
	};
}

export const loginAction = async (
	formData: LoginFormData,
): Promise<ActionResult<CreateSessionDao | null>> => {
	try {
		const response = await postRequest<CreateSessionDao, CreateSessionDto>(
			"/login-user/",
			{
				email: formData.email,
				password: formData.password,
			},
		);

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
		console.log("Registering user", { formData });
		const response = await postRequest<CreateAccountDao, CreateAccountDto>(
			"/user/create/",
			{
				full_name: formData.legalName,
				preferred_name: formData.preferredName,
				email: formData.email,
				password: formData.password,
				role: formData.role === "Freelancer" ? 1 : 2,
			},
		);

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

export const verifyOtpAction = async (
	formData: VerifyEmailOTPDto,
): Promise<ActionResult<VerifyEmailOTPDao | null>> => {
	try {
		const response = await postRequest<VerifyEmailOTPDao, VerifyEmailOTPDto>(
			"/verify-otp/",
			{ email: formData.email, otp: formData.otp },
		);

		return {
			success: true,
			data: response.data.data,
			status: response.status,
			message: response.data.message ?? "OTP verified successfully",
		};
	} catch (error) {
		return handleApiError(error, "OTP verification failed. Please try again.");
	}
};

export const resendOtpAction = async (
	formData: ResendEmailOTPDto,
): Promise<ActionResult<ResendEmailOTPDao | null>> => {
	try {
		const response = await postRequest<ResendEmailOTPDao, ResendEmailOTPDto>(
			"/resend-otp/",
			{ email: formData.email },
		);

		return {
			success: true,
			data: response.data.data,
			status: response.status,
			message: response.data.message ?? "OTP resent successfully",
		};
	} catch (error) {
		return handleApiError(error, "Failed to resend OTP. Please try again.");
	}
};
