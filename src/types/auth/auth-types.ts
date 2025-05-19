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

export type ResendEmailOTPDto = {
	email: string;
};

export type ResendEmailOTPDao = null;

export type UserRole = "freelancer" | "contractor";
