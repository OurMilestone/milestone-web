"use server";
import axios from "axios";

const paystackInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_PAYSTACK_BASE_API,
	timeout: 20000,
	headers: {
		Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

export default paystackInstance;
