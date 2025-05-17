import axios, {
	type AxiosError,
	AxiosInstance,
	type AxiosResponse,
	type AxiosRequestConfig,
} from "axios";
import axiosInstance from "./axios-config";

export interface ApiResponse<T> {
	data: T;
	status: number;
	statusText: string;
}

export interface ApiError {
	message: string;
	status?: number;
	data?: unknown;
}

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

const handleError = (error: AxiosError): ApiError => {
	return {
		message: error.message || "An unexpected error occurred",
		status: error.response?.status,
		data: error.response?.data,
	};
};

export const apiClient = {
	async get<T>(
		url: string,
		requireAuth = false,
		config: AxiosRequestConfig = {},
	): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<T> = await axiosInstance.get(
				url,
				getConfig(config, requireAuth),
			);
			return {
				data: response.data,
				status: response.status,
				statusText: response.statusText,
			};
		} catch (error) {
			throw handleError(error as AxiosError);
		}
	},

	async post<T, D>(
		url: string,
		data: D,
		requireAuth = false,
		config: AxiosRequestConfig = {},
	): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<T> = await axiosInstance.post(
				url,
				data,
				getConfig(config, requireAuth),
			);
			return {
				data: response.data,
				status: response.status,
				statusText: response.statusText,
			};
		} catch (error) {
			throw handleError(error as AxiosError);
		}
	},

	async put<T, D>(
		url: string,
		data: D,
		requireAuth = false,
		config: AxiosRequestConfig = {},
	): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<T> = await axiosInstance.put(
				url,
				data,
				getConfig(config, requireAuth),
			);
			return {
				data: response.data,
				status: response.status,
				statusText: response.statusText,
			};
		} catch (error) {
			throw handleError(error as AxiosError);
		}
	},

	async patch<T, D>(
		url: string,
		data: D,
		requireAuth = false,
		config: AxiosRequestConfig = {},
	): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<T> = await axiosInstance.patch(
				url,
				data,
				getConfig(config, requireAuth),
			);
			return {
				data: response.data,
				status: response.status,
				statusText: response.statusText,
			};
		} catch (error) {
			throw handleError(error as AxiosError);
		}
	},

	async delete<T>(
		url: string,
		requireAuth = false,
		config: AxiosRequestConfig = {},
	): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<T> = await axiosInstance.delete(
				url,
				getConfig(config, requireAuth),
			);
			return {
				data: response.data,
				status: response.status,
				statusText: response.statusText,
			};
		} catch (error) {
			throw handleError(error as AxiosError);
		}
	},
};
