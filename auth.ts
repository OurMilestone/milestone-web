import authOptions from "@/config/auth.config";
import NextAuth, { type DefaultSession } from "next-auth";
import type { User } from "./src/types/auth/auth-types";

export const {
	handlers: { GET, POST },
	auth,
	unstable_update,
	signIn,
	signOut,
} = NextAuth({
	...authOptions,
});

declare module "next-auth" {
	interface Session {
		user: User & DefaultSession["user"];
	}
}
