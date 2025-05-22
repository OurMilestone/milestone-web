"use client";

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
	logout: () => void;
}>({
	user: defaultUserContext,
	setUser: () => {},
	logout: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserContext>(defaultUserContext);
	const { data: session, status } = useSession();
	const [userData, setUserData, removeUserData] =
		useLocalStorage<UserContext | null>("user", null);
	const [authToken, setAuthToken, removeAuthToken] = useLocalStorage<
		string | null
	>("authToken", null);
	const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<
		string | null
	>("refreshToken", null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (status === "authenticated") {
			const updatedUserData = {
				id: session.user.id,
				email: session.user.email,
				role: session.user.role,
				access: session.user.access,
				refresh: session.user.refresh,
				full_name: session.user.full_name,
				preferred_name: session.user.preferred_name,
				username: session.user.username,
				is_verified: session.user.is_verified,
			};

			setUser(updatedUserData);
			setUserData(updatedUserData);
			setAuthToken(session.user.access);
			setRefreshToken(session.user.refresh);
		} else {
			const storedUserData = userData;
			if (storedUserData) {
				setUser(storedUserData);
			} else {
				setUser(defaultUserContext);
			}
		}
	}, [status, session]);

	const logout = () => {
		signOut({ redirect: false });
		setUser(defaultUserContext);
		removeUserData();
		removeAuthToken();
		removeRefreshToken();
	};

	return (
		<AuthContext.Provider value={{ user, setUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => useContext(AuthContext);
