import { loginAction } from "@/actions/auth-actions/auth.actions";
import { loginFormSchema } from "@/lib/schemas/auth-schema";
import type { CustomJWT, UserRole } from "@/types/auth/auth-types";
import type { NextAuthConfig, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { env } from "../../env.mjs";

const isDevelopment = process.env.NODE_ENV === "development";

const authOptions: NextAuthConfig = {
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const validatedFields = loginFormSchema.safeParse(credentials);

				if (!validatedFields.success) {
					throw new Error("Invalid email or password");
				}

				const { email, password } = validatedFields.data;
				const response = await loginAction({ email, password });

				if (!response || !response.success || !response.data) {
					throw new Error("Invalid email or password");
				}

				const user = response.data as unknown as CustomJWT;
				user.access = response.data.access;
				user.refresh = response.data.refresh;

				return user;
			},
		}),
	],

	session: {
		strategy: "jwt",
		maxAge: 7 * 24 * 60 * 60, // 7 days
	},
	callbacks: {
		async signIn({ user }) {
			return !!user;
		},
		async jwt({ user, token }) {
			if (user) {
				return {
					...token,
					user: { ...user },
				} as CustomJWT;
			}

			return token;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			const customToken = token as CustomJWT;

			if (!customToken || !customToken.user.id) {
				return {
					...session,
					user: {
						id: "",
						email: "",
						role: "",
						full_name: "",
						preferred_name: "",
						is_verified: false,
						paystack_customer_id: "",
						stripe_customer_id: "",
						username: "",
						access: "",
						refresh: "",
					},
					expires: new Date(0).toString(),
				};
			}

			session.user = {
				id: customToken.user.id as string,
				email: customToken.user.email as string,
				role: customToken.user.role as UserRole,
				full_name: customToken.user.full_name as string,
				preferred_name: customToken.user.preferred_name as string,
				is_verified: customToken.user.is_verified as boolean,
				paystack_customer_id: customToken.user.paystack_customer_id as string,
				stripe_customer_id: customToken.user.stripe_customer_id as string,
				username: customToken.user.username as string,
				access: customToken.user.access as string,
				refresh: customToken.user.refresh as string,
			};

			session.expires = customToken.expires as string;

			console.log("session in session", { session });

			return session;
		},
	},
	debug: isDevelopment,
	secret: env.AUTH_SECRET,
	trustHost: true,
	pages: {
		signIn: "/login",
	},
};

export default authOptions;
