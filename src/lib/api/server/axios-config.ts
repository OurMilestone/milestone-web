import axios from "axios";

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

axiosInstance.interceptors.request.use(
	(config) => {
		if (process.env.NODE_ENV === "development") {
			console.log(
				`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
			);
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
	(error) => {
		if (process.env.NODE_ENV === "development") {
			console.error(
				`❌ API Error: ${error.response?.status || "Network"} ${error.config?.url}`,
			);
		}

		if (!error.response) {
			const networkError = new Error(
				"Network error - please check your connection",
			);
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(networkError as any).isCorsError = true;
			return Promise.reject(networkError);
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;
