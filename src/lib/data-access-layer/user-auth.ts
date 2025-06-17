import "server-only";
import { AppRoutePaths } from "@/config/routes-config";
import type { User, UserRole } from "@/types/auth/auth-types";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "../../../auth";

export type AuthenticatedUser = Omit<
	User,
	"username" | "paystack_customer_id" | "stripe_customer_id" | "refresh"
>;

export const checkUserSession = cache(async (): Promise<AuthenticatedUser> => {
	const session = await auth();

	if (!session?.user) {
		redirect(AppRoutePaths.SignIn);
	}

	const user = session.user;

	if (!user.access) {
		redirect(AppRoutePaths.SignIn);
	}

	return {
		id: user.id,
		email: user.email || "",
		role: user.role || "Freelancer",
		access: user.access,
		full_name: user.full_name || "",
		preferred_name: user.preferred_name || "",
		is_verified: user.is_verified || false,
	};
});

export const checkUserRole = cache(
	async (allowedRoles: UserRole[]): Promise<AuthenticatedUser> => {
		const user = await checkUserSession();

		if (!allowedRoles.includes(user.role)) {
			const redirectPath =
				user.role === "Contractor"
					? AppRoutePaths.ContractorDashboard.Home
					: AppRoutePaths.FreelancerDashboard.Home;
			redirect(redirectPath);
		}

		return user;
	},
);
