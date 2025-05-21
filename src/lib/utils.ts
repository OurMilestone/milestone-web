import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const nextAuthErrorMessagesMap: Record<string, string> = {
	CredentialsSignin: "Invalid email or password",
	Configuration: "Invalid email or password",
	OAuthSignin: "Unable to sign in with the selected provider.",
	OAuthCallback: "Unable to sign in with the selected provider.",
	OAuthCreateAccount: "Unable to create account with the selected provider.",
	EmailCreateAccount: "Unable to create account with email.",
	Callback: "An error occurred during sign in.",
	OAuthAccountNotLinked:
		"An account with this email already exists. Please sign in with the provider you used originally.",
	EmailSignin: "Unable to send sign-in email.",
	SessionRequired: "Please sign in to access this page.",
	AccessDenied: "You do not have permission to sign in.",
	Verification: "The verification link is invalid or has expired.",
	Default: "An unknown error occurred. Please try again.",
};
