import { auth } from "../../../../auth";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}
const API_BASE_URL =
	"https://8bmx14wuvb.execute-api.us-east-1.amazonaws.com/dev/api/v1";

async function getAuthToken(): Promise<string | null> {
	try {
		const session = await auth();
		return session?.user?.access || null;
	} catch (error) {
		console.error("Failed to get auth token:", error);
		return null;
	}
}

async function makeAuthenticatedRequest<T>(
	endpoint: string,
	options: {
		method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		body?: any;
		headers?: Record<string, string>;
	},
): Promise<ApiResponse<T>> {
	try {
		const token = await getAuthToken();

		if (!token) {
			return {
				success: false,
				error: "Authentication required. Please log in again.",
			};
		}

		const url = `${API_BASE_URL}${endpoint}`;

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
			...options.headers,
		};

		const fetchOptions: RequestInit = {
			method: options.method,
			headers,
		};

		if (options.body && options.method !== "GET") {
			fetchOptions.body = JSON.stringify(options.body);
		}

		const response = await fetch(url, fetchOptions);

		const responseData = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error:
					responseData.message ||
					`HTTP ${response.status}: ${response.statusText}`,
				data: responseData,
			};
		}

		return {
			success: true,
			data: responseData.data || responseData,
			message: responseData.message,
		};
	} catch (error) {
		console.error("API Request failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
	return makeAuthenticatedRequest<T>(endpoint, { method: "GET" });
}

export async function apiPost<T>(
	endpoint: string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any,
): Promise<ApiResponse<T>> {
	return makeAuthenticatedRequest<T>(endpoint, {
		method: "POST",
		body: data,
	});
}

export async function apiPut<T>(
	endpoint: string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any,
): Promise<ApiResponse<T>> {
	return makeAuthenticatedRequest<T>(endpoint, {
		method: "PUT",
		body: data,
	});
}

export async function apiPatch<T>(
	endpoint: string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any,
): Promise<ApiResponse<T>> {
	return makeAuthenticatedRequest<T>(endpoint, {
		method: "PATCH",
		body: data,
	});
}

export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
	return makeAuthenticatedRequest<T>(endpoint, { method: "DELETE" });
}
