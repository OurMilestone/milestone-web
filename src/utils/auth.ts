import { AppRoutePaths } from "@/config/routes-config";
import { signOut } from "next-auth/react";

export function logoutUser() {
	localStorage.removeItem("authToken");
	localStorage.removeItem("refreshToken");
	localStorage.removeItem("user");
	return signOut({ redirect: true, callbackUrl: AppRoutePaths.SignIn });
}
