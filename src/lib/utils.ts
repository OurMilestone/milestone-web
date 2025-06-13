import type { ActionResult } from "@/types";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApiResponse } from "./api/server/server-api-client";
import { Currency } from "./constants";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const nextAuthErrorMessagesMap: Record<string, string> = {
	CredentialsSignin: "Invalid email or password",
	Configuration: "Invalid email or password",
	OAuthSignin: "Unable to sign in with the selected provider.",
	OAuthCallback: "Unable to sign in with the selected provider.",
	OAuthCreateAccount: "Unable to create account with the selected provider.",
	EmailCreateAccount: "Unable to create account with email.",
	Callback: "An error occurred during sign in.",
	OAuthAccountNotLinked:
		"An account with this email already exists. Please sign in with the provider you used originally.",
	EmailSignin: "Unable to send sign-in email.",
	SessionRequired: "Please sign in to access this page.",
	AccessDenied: "You do not have permission to sign in.",
	Verification: "The verification link is invalid or has expired.",
	Default: "An unknown error occurred. Please try again.",
};

export const isValidCardNumber = (cardNumber: string): boolean => {
	let sum = 0;
	let shouldDouble = false;
	for (let i = cardNumber.length - 1; i >= 0; i--) {
		let digit = Number.parseInt(cardNumber.charAt(i));
		if (shouldDouble) {
			digit *= 2;
			if (digit > 9) {
				digit -= 9;
			}
		}
		sum += digit;
		shouldDouble = !shouldDouble;
	}
	return sum % 10 === 0;
};

export const generateMonthOptions = () => {
	return Array.from({ length: 12 }, (_, i) => {
		const month = (i + 1).toString().padStart(2, "0");
		return { value: month, label: month };
	});
};

export const generateYearOptions = (startYearOffset = 0, count = 10) => {
	const currentYear = new Date().getFullYear() + startYearOffset;

	return Array.from({ length: count }, (_, i) => {
		const year = (currentYear + i).toString();
		return { value: year, label: year };
	});
};

export const getInitials = (name: string): string => {
	return name
		.split(" ")
		.map((n) => n[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();
};

export const getUserColor = (userId: string): string => {
	const colors = [
		"bg-blue-200",
		"bg-green-200",
		"bg-purple-200",
		"bg-pink-200",
		"bg-yellow-200",
		"bg-indigo-200",
		"bg-red-200",
		"bg-cyan-200",
	];

	let hash = 0;

	for (let i = 0; i < userId?.length; i++) {
		hash = ((hash << 5) - hash + userId.charCodeAt(i)) & 0xffffffff;
	}
	return colors[Math.abs(hash) % colors.length];
};

export const formatCurrency = (
	amount: number,
	currency = "USD",
	locale = "en-US",
): string => {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
	}).format(amount);
};

export function handleApiError(
	error: unknown,
	defaultMsg: string,
): ActionResult<null> {
	console.warn("Auth Action Error:", error);

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
