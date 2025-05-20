import axios from "axios";
import { env } from "../../../env.mjs";

const axiosInstance = axios.create({
	baseURL: env.NEXT_PUBLIC_API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

export default axiosInstance;
