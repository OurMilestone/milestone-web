import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]),
		AUTH_SECRET: z.string(),
	},

	client: {
		NEXT_PUBLIC_BASE_URL: z.string().min(1),
		NEXT_PUBLIC_API_BASE_URL: z.string().url(),
	},

	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		AUTH_SECRET: process.env.AUTH_SECRET,
	},
});
