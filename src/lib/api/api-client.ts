"use server";

import type { AxiosApiResponse } from "@/types";
import type { ApiResponse } from "@/types/auth/auth-types";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosInstance from "./axios-config";

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

	throw error;
};

async function makeRequest<T>(
	method: "get" | "post" | "put" | "patch" | "delete",
	url: string,
	requireAuth = false,
	data?: unknown,
	config: AxiosRequestConfig = {},
	authTokenOverride?: string,
): Promise<AxiosApiResponse<T>> {
	let finalConfig = { ...config };
	let tokenToUse: string | null = null;

	if (authTokenOverride) {
		tokenToUse = authTokenOverride;
	} else if (requireAuth && typeof window !== "undefined") {
		tokenToUse = getClientAuthToken();
	}

	if (requireAuth && !tokenToUse && typeof window === "undefined") {
		throw new Error(
			`API Client: 'requireAuth' is true for URL "${url}" on the server, but no 'authTokenOverride' was provided`,
		);
	}

	finalConfig = applyAuthHeader(finalConfig, tokenToUse);

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
	authTokenOverride?: string,
): Promise<AxiosApiResponse<T>> {
	return makeRequest<T>(
		"get",
		url,
		requireAuth,
		undefined,
		config,
		authTokenOverride,
	);
}

export async function postRequest<T, D>(
	url: string,
	data: D,
	requireAuth = false,
	config: AxiosRequestConfig = {},
	authTokenOverride?: string,
): Promise<AxiosApiResponse<T>> {
	return makeRequest<T>(
		"post",
		url,
		requireAuth,
		data,
		config,
		authTokenOverride,
	);
}

export async function putRequest<T, D>(
	url: string,
	data: D,
	requireAuth = false,
	config: AxiosRequestConfig = {},
	authTokenOverride?: string,
): Promise<AxiosApiResponse<T>> {
	return makeRequest<T>(
		"put",
		url,
		requireAuth,
		data,
		config,
		authTokenOverride,
	);
}

export async function patchRequest<T, D>(
	url: string,
	data: D,
	requireAuth = false,
	config: AxiosRequestConfig = {},
	authTokenOverride?: string,
): Promise<AxiosApiResponse<T>> {
	return makeRequest<T>(
		"patch",
		url,
		requireAuth,
		data,
		config,
		authTokenOverride,
	);
}

export async function deleteRequest<T>(
	url: string,
	requireAuth = false,
	config: AxiosRequestConfig = {},
	authTokenOverride?: string,
): Promise<AxiosApiResponse<T>> {
	return makeRequest<T>(
		"delete",
		url,
		requireAuth,
		undefined,
		config,
		authTokenOverride,
	);
}
