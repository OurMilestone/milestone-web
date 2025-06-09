import axios from "axios";

const API_BASE_URL =
	"https://8bmx14wuvb.execute-api.us-east-1.amazonaws.com/dev/api/v1";

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

export default axiosInstance;
