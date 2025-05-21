export const AppRoutePaths = {
	Index: "/",
	SignUp: "/register",
	SignIn: "/login",
	CheckRole: "/post-login-redirect",
	VerifyEmail: "/verify-email",
	ForgotPassword: "/forgot-password",
	Onboarding: "/onboarding",
	FreelancerDashboard: {
		Home: "/freelancer/dashboard/overview",
		Notifications: "/freelancer/dashboard/notifications",
		Projects: {
			Home: "/freelancer/dashboard/projects",
		},
		Workers: {
			Home: "/freelancer/dashboard/workers",
		},
		Payments: {
			Home: "/freelancer/dashboard/payments",
		},
	},
	ContractorDashboard: {
		Home: "/contractor/dashboard/overview",
		Notifications: "/contractor/dashboard/notifications",
		Projects: {
			Home: "/contractor/dashboard/projects",
		},
		Workers: {
			Home: "/contractor/dashboard/workers",
		},
		Payments: {
			Home: "/contractor/dashboard/payments",
		},
	},
};
