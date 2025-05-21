"use server";

import type { ApiError, AxiosApiResponse } from "@/types";
import type { ApiResponse } from "@/types/auth/auth-types";
import axios, {
	type AxiosError,
	AxiosInstance,
	type AxiosResponse,
	type AxiosRequestConfig,
} from "axios";
import axiosInstance from "./axios-config";

function getAuthToken(): string | null {
	if (typeof window !== "undefined") {
		return localStorage.getItem("authToken");
	}
	return null;
}

function getConfig(
	config: AxiosRequestConfig = {},
	requireAuth = false,
): AxiosRequestConfig {
	if (requireAuth) {
		const token = getAuthToken();

		if (token) {
			return {
				...config,
				headers: {
					...config.headers,
					Authorization: `Bearer ${token}`,
				},
			};
		}
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

export async function getRequest<T>(
	url: string,
	requireAuth = false,
	config: AxiosRequestConfig = {},
): Promise<AxiosApiResponse<T>> {
	try {
		const response: AxiosResponse<T> = await axiosInstance.get(
			url,
			getConfig(config, requireAuth),
		);

		return {
			data: response.data as ApiResponse<T>,
			status: response.status,
			statusText: response.statusText,
		};
	} catch (error) {
		throw handleError(error as AxiosError);
	}
}

export async function postRequest<T, D>(
	url: string,
	data: D,
	requireAuth = false,
	config: AxiosRequestConfig = {},
): Promise<AxiosApiResponse<T>> {
	try {
		const response: AxiosResponse<T> = await axiosInstance.post(
			url,
			data,
			getConfig(config, requireAuth),
		);

		return {
			data: response.data as ApiResponse<T>,
			status: response.status,
			statusText: response.statusText,
		};
	} catch (error) {
		throw handleError(error as AxiosError);
	}
}

export async function putRequest<T, D>(
	url: string,
	data: D,
	requireAuth = false,
	config: AxiosRequestConfig = {},
): Promise<AxiosApiResponse<T>> {
	try {
		const response: AxiosResponse<T> = await axiosInstance.put(
			url,
			data,
			getConfig(config, requireAuth),
		);
		return {
			data: response.data as ApiResponse<T>,
			status: response.status,
			statusText: response.statusText,
		};
	} catch (error) {
		throw handleError(error as AxiosError);
	}
}

export async function patchRequest<T, D>(
	url: string,
	data: D,
	requireAuth = false,
	config: AxiosRequestConfig = {},
): Promise<AxiosApiResponse<T>> {
	try {
		const response: AxiosResponse<T> = await axiosInstance.patch(
			url,
			data,
			getConfig(config, requireAuth),
		);
		return {
			data: response.data as ApiResponse<T>,
			status: response.status,
			statusText: response.statusText,
		};
	} catch (error) {
		throw handleError(error as AxiosError);
	}
}

export async function deleteRequest<T>(
	url: string,
	requireAuth = false,
	config: AxiosRequestConfig = {},
): Promise<AxiosApiResponse<T>> {
	try {
		const response: AxiosResponse<T> = await axiosInstance.delete(
			url,
			getConfig(config, requireAuth),
		);
		return {
			data: response.data as ApiResponse<T>,
			status: response.status,
			statusText: response.statusText,
		};
	} catch (error) {
		throw handleError(error as AxiosError);
	}
}
