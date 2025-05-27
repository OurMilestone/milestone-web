"use client";

import { AppRoutePaths } from "@/config/routes-config";
import type { Expand } from "@/types";
import type { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";

export type UserContext = Expand<
	Omit<
		Session["user"],
		"paystack_customer_id" | "stripe_customer_id" | "name" | "image"
	>
>;

const defaultUserContext: UserContext = {
	id: "",
	email: "",
	role: "Freelancer",
	access: "",
	refresh: "",
	full_name: "",
	preferred_name: "",
	username: "",
	is_verified: false,
};

export const AuthContext = createContext<{
	user: UserContext;
	setUser: (user: UserContext) => void;
	logout: () => Promise<void>;
}>({
	user: defaultUserContext,
	setUser: () => {},
	logout: async () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserContext>(defaultUserContext);
	const { data: session, status } = useSession();
	const [userData, setUserData, removeUserData] =
		useLocalStorage<UserContext | null>("user", null);
	const [_, setAuthToken, removeAuthToken] = useLocalStorage<string | null>(
		"authToken",
		null,
	);
	const [__, setRefreshToken, removeRefreshToken] = useLocalStorage<
		string | null
	>("refreshToken", null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (status === "authenticated" && session?.user) {
			const updatedUserData = {
				id: session.user.id || "",
				email: session.user.email || "",
				role: session.user.role || "Freelancer",
				access: session.user.access || "",
				refresh: session.user.refresh || "",
				full_name: session.user.full_name || "",
				preferred_name: session.user.preferred_name || "",
				username: session.user.username || "",
				is_verified: session.user.is_verified || false,
			};

			setUser(updatedUserData);
			setUserData(updatedUserData);
			if (session.user.access) setAuthToken(session.user.access);
			if (session.user.refresh) setRefreshToken(session.user.refresh);
		} else if (status === "unauthenticated") {
			const storedUserData = userData;

			if (storedUserData && !session) {
				setUser(storedUserData);
			} else if (!session) {
				setUser(defaultUserContext);
				removeUserData();
				removeAuthToken();
				removeRefreshToken();
			}
		}
	}, [status, session]);

	const logout = async (): Promise<void> => {
		try {
			await signOut({ redirect: true, callbackUrl: AppRoutePaths.SignIn });

			setUser(defaultUserContext);
			removeUserData();
			removeAuthToken();
			removeRefreshToken();
		} catch (error) {
			console.error("Error during logout:", error);
			throw error;
		}
	};

	return (
		<AuthContext.Provider value={{ user, setUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => useContext(AuthContext);
