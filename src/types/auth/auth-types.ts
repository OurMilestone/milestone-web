import type {
	loginFormSchema,
	registerFormSchema,
} from "@/lib/schemas/auth-schema";
import type { DefaultSession, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { z } from "zod";
import type { Expand } from "../index";

export type ApiResponse<T> = {
	status: boolean;
	data: T;
	message: string;
};

export type CreateAccountDto = {
	full_name: string;
	preferred_name: string;
	email: string;
	role: number;
	password: string;
};

export type CreateAccountDao = {
	id: string;
	email: string;
	role: string;
	full_name: string;
	preferred_name: string;
	is_verified: boolean;
	paystack_customer_id: string;
	stripe_customer_id: string | null;
	username: string;
};

export type CreateSessionDto = {
	email: string;
	password: string;
};

export type CreateSessionDao = {
	refresh: string;
	access: string;
	user_data: {
		id: string;
		email: string;
		role: string;
		full_name: string;
		preferred_name: string;
		is_verified: boolean;
		paystack_customer_id: string;
		stripe_customer_id: string | null;
		username: string;
	};
};

export type VerifyEmailOTPDto = {
	email: string;
	otp: string;
};

export type VerifyEmailOTPDao = {
	message: string;
};

export type ResendEmailOTPDto = {
	email: string;
};

export type ResendEmailOTPDao = {
	message: string;
};

export type UserRole = "Freelancer" | "Contractor";

export type User = {
	id: string;
	email: string;
	role: UserRole;
	full_name: string;
	preferred_name: string;
	is_verified: boolean;
	paystack_customer_id: string | null;
	stripe_customer_id: string | null;
	username: string | null;
	access: string;
	refresh: string;
};

export interface CustomSession extends Session {
	user: User;
	expires: DefaultSession["expires"];
}

export interface CustomJWT extends JWT {
	user: User;
}

export type LoginFormData = z.infer<typeof loginFormSchema>;

export type RegisterFormData = Expand<
	z.infer<typeof registerFormSchema> & {
		role: UserRole;
	}
>;
