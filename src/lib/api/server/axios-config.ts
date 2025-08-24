import { logoutUser } from "@/utils/auth";
import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
	"https://8bmx14wuvb.execute-api.us-east-1.amazonaws.com/dev/api/v1";

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

let isRefreshing = false;
let failedQueue: {
	resolve: (token: string) => void;
	reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
	for (const prom of failedQueue) {
		if (error) {
			prom.reject(error);
		} else {
			if (token !== null) {
				prom.resolve(token);
			} else {
				throw new Error("Token is null");
			}
		}
	}
	failedQueue = [];
};

axiosInstance.interceptors.request.use(
	(config) => {
		if (process.env.NODE_ENV === "development") {
			console.log(
				`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
			);
		}

		// Attach access token if available
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("authToken");
			if (token && config.headers) {
				config.headers.set("Authorization", `Bearer ${token}`);
			}
		}

		return config;
	},
	(error) => {
		console.error("Request interceptor error:", error);
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response) => {
		if (process.env.NODE_ENV === "development") {
			console.log(`✅ API Response: ${response.status} ${response.config.url}`);
		}
		return response;
	},
	async (error: AxiosError) => {
		if (process.env.NODE_ENV === "development") {
			console.error(
				`❌ API Error: ${error.response?.status || "Network"} ${error.config?.url}`,
			);
		}

		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		// Handle 401 (Unauthorized)
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({
						resolve: (token: string) => {
							if (originalRequest.headers) {
								originalRequest.headers.set("Authorization", `Bearer ${token}`);
							}

							resolve(axiosInstance(originalRequest));
						},
						reject: (err) => reject(err),
					});
				});
			}

			isRefreshing = true;

			try {
				const refreshToken =
					typeof window !== "undefined"
						? localStorage.getItem("refreshToken")
						: null;

				if (!refreshToken) {
					throw new Error("No refresh token available");
				}

				const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
					refresh: refreshToken,
				});

				const newAccessToken = response.data?.data?.access;
				const newRefreshToken = response.data?.data?.refresh ?? refreshToken;

				// Save tokens
				if (typeof window !== "undefined") {
					localStorage.setItem("authToken", newAccessToken);
					localStorage.setItem("refreshToken", newRefreshToken);
				}

				processQueue(null, newAccessToken);

				if (originalRequest.headers) {
					originalRequest.headers.set(
						"Authorization",
						`Bearer ${newAccessToken}`,
					);
				}

				return axiosInstance(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);

				// Clear storage and redirect
				if (typeof window !== "undefined") {
					logoutUser();
				}

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;
