import { loginAction } from "@/actions/auth-actions/auth.actions";
import { loginFormSchema } from "@/lib/schemas/auth-schema";
import type {
	CreateSessionDao,
	CustomJWT,
	User,
	UserRole,
} from "@/types/auth/auth-types";
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
					console.error(
						"Authorize: Invalid fields",
						validatedFields.error.flatten().fieldErrors,
					);
					throw new Error("Invalid email or password");
				}

				const { email, password } = validatedFields.data;
				const response = await loginAction({ email, password });

				if (!response || !response.success || !response.data) {
					console.error("Authorize: Login action failed or no data", response);
					throw new Error("Invalid email or password");
				}

				const apiResponse = response.data as CreateSessionDao;

				const userForAuth: User = {
					id: apiResponse.user_data.id,
					email: apiResponse.user_data.email,
					role: apiResponse.user_data.role as UserRole,
					full_name: apiResponse.user_data.full_name,
					preferred_name: apiResponse.user_data.preferred_name,
					is_verified: apiResponse.user_data.is_verified,
					paystack_customer_id: apiResponse.user_data.paystack_customer_id,
					stripe_customer_id: apiResponse.user_data.stripe_customer_id,
					username: apiResponse.user_data.username,
					access: apiResponse.access,
					refresh: apiResponse.refresh,
				};

				return userForAuth;
			},
		}),
	],

	session: {
		strategy: "jwt",
		maxAge: 7 * 24 * 60 * 60,
	},
	callbacks: {
		async signIn({ user }) {
			return !!user;
		},
		async jwt({ user, token, trigger }) {
			if (user) {
				const authorizedUser = user as User;
				token.user = authorizedUser;
				token.access = authorizedUser.access;
				token.refresh = authorizedUser.refresh;
				token.expires = new Date(
					Date.now() + 7 * 24 * 60 * 60 * 1000,
				).toISOString();
				token.id = authorizedUser.id;
				token.email = authorizedUser.email;
				token.role = authorizedUser.role;
				token.full_name = authorizedUser.full_name;
				token.preferred_name = authorizedUser.preferred_name;
				token.is_verified = authorizedUser.is_verified;
				token.paystack_customer_id = authorizedUser.paystack_customer_id;
				token.sub = authorizedUser.id;
			}

			return token;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			const customToken = token as CustomJWT;

			if (customToken?.user?.id || session.user) {
				session.user.id = customToken.user.id;
				session.user.email = customToken.user.email;
				session.user.role = customToken.user.role;
				session.user.full_name = customToken.user.full_name;
				session.user.preferred_name = customToken.user.preferred_name;
				session.user.is_verified = customToken.user.is_verified;
				session.user.paystack_customer_id =
					customToken.user.paystack_customer_id;
				session.user.stripe_customer_id = customToken.user.stripe_customer_id;
				session.user.username = customToken.user.username;
				session.user.access = customToken.user.access;
				session.user.refresh = customToken.user.refresh;
				session.user.image = null;
				session.user.name =
					customToken.user.full_name ?? customToken.user.preferred_name;
			} else {
				console.warn(
					"Session callback: customToken.user or its id is missing. Resetting session.user to defaults.",
				);
				session.user = {
					id: "",
					email: "",
					role: "" as UserRole,
					full_name: "",
					preferred_name: "",
					is_verified: false,
					paystack_customer_id: null,
					stripe_customer_id: null,
					username: null,
					access: "",
					refresh: "",
					name: undefined,
					image: undefined,
				};

				session.expires = new Date(0).toISOString();
				return session;
			}

			if (customToken.exp) {
				session.expires = new Date(customToken.exp * 1000).toISOString();
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} else if ((customToken as any).expires) {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				session.expires = (customToken as any).expires as string;
			}

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
