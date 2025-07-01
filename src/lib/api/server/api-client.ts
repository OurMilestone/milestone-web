// import "server-only";
import type { ActionResult, AxiosApiResponse } from "@/types";
import type { ApiResponse } from "@/types/auth/auth-types";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { auth } from "../../../../auth";
import axiosInstance from "./axios-config";

async function getAuthToken(): Promise<string | null> {
	if (typeof window === "undefined") {
		try {
			const session = await auth();
			return session?.user?.access || null;
		} catch (error) {
			console.error("Failed to get an auth toke on the server: ", error);
			return null;
		}
	} else {
		return localStorage.getItem("authToken");
	}
}

function getClientAuthToken(): string | null {
	if (typeof window !== "undefined") {
		return localStorage.getItem("authToken");
	}
	return null;
}

function applyAuthHeader(
	config: AxiosRequestConfig,
	token: string | null,
): AxiosRequestConfig {
	if (token) {
		return {
			...config,
			headers: {
				...config.headers,
				Authorization: `Bearer ${token}`,
			},
		};
	}

	return config;
}

const handleError = (error: AxiosError): never => {
	console.error("API Request Error:", {
		message: error.message,
		status: error.response?.status,
		data: error.response?.data,
		url: error.config?.url,
		method: error.config?.method,
	});

	if (typeof window !== "undefined" && error.response?.status) {
		const apiError = new Error(`API Error: ${error.response.status}`);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(apiError as any).status = error.response.status;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(apiError as any).isCorsError =
			error.message.includes("CORS") || error.code === "ERR_NETWORK";
		throw apiError;
	}

	throw error;
};

async function makeRequest<T>(
	method: "get" | "post" | "put" | "patch" | "delete",
	url: string,
	requireAuth = false,
	data?: unknown,
	config: AxiosRequestConfig = {},
): Promise<AxiosApiResponse<T>> {
	const finalConfig: AxiosRequestConfig = {
		...config,
		headers: {
			"Content-Type": "application/json",
			...config.headers,
		},
	};

	if (requireAuth) {
		const token = await getAuthToken();
		if (!token) {
			throw new axios.AxiosError(
				"Authentication required. No token available",
				"401",
			);
		}

		finalConfig.headers = {
			...finalConfig.headers,
			Authorization: `Bearer ${token}`,
		};
	}

	try {
		let response: AxiosResponse<T>;
		switch (method) {
			case "get":
				response = await axiosInstance.get<T>(url, finalConfig);
				break;
			case "post":
				response = await axiosInstance.post<T>(url, data, finalConfig);
				break;
			case "put":
				response = await axiosInstance.put<T>(url, data, finalConfig);
				break;
			case "patch":
				response = await axiosInstance.patch<T>(url, data, finalConfig);
				break;
			case "delete":
				response = await axiosInstance.delete<T>(url, finalConfig);
				break;
			default:
				throw new Error(`Unsupported HTTP method: ${method}`);
		}

		// console.log("response", response.data);
		return {
			data: response.data as ApiResponse<T>,
			status: response.status,
			statusText: response.statusText,
		};
	} catch (error) {
		throw handleError(error as AxiosError);
	}
}

export async function getRequest<T>(
	url: string,
	requireAuth = false,
	config: AxiosRequestConfig = {},
): Promise<AxiosApiResponse<T>> {
	return makeRequest<T>("get", url, requireAuth, undefined, config);
}

export async function postRequest<T, D>(
	url: string,
	data: D,
	requireAuth = false,
	config: AxiosRequestConfig = {},
): Promise<AxiosApiResponse<T>> {
	return makeRequest<T>("post", url, requireAuth, data, config);
}

export async function putRequest<T, D>(
	url: string,
	data: D,
	requireAuth = false,
	config: AxiosRequestConfig = {},
): Promise<AxiosApiResponse<T>> {
	return makeRequest<T>("put", url, requireAuth, data, config);
}

export async function patchRequest<T, D>(
	url: string,
	data: D,
	requireAuth = false,
	config: AxiosRequestConfig = {},
): Promise<AxiosApiResponse<T>> {
	return makeRequest<T>("patch", url, requireAuth, data, config);
}

export async function deleteRequest<T>(
	url: string,
	requireAuth = false,
	config: AxiosRequestConfig = {},
): Promise<AxiosApiResponse<T>> {
	return makeRequest<T>("delete", url, requireAuth, undefined, config);
}
