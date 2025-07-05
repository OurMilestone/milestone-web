export const AppRoutePaths = {
	Index: "/",
	Home: "/home",
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
			Taskboard: (projectTitle: string) =>
				`/freelancer/dashboard/projects/${projectTitle}/taskboard`,
			TaskDetail: (projectSlug: string, taskId: string) =>
				`/freelancer/dashboard/projects/${projectSlug}/task/${taskId}`,
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
			Taskboard: (projectTitle: string) =>
				`/contractor/dashboard/projects/${projectTitle}/taskboard`,
			TaskDetail: (projectSlug: string, taskId: string) =>
				`/contractor/dashboard/projects/${projectSlug}/task/${taskId}`,
		},
		Workers: {
			Home: "/contractor/dashboard/workers",
		},
		Payments: {
			Home: "/contractor/dashboard/payments",
		},
	},
};
