import { AppRoutePaths } from "@/config/routes-config";
import { NextResponse } from "next/server";
import { auth } from "../auth";

const ASSET_EXTENSIONS = [
	".js",
	".css",
	".png",
	".jpg",
	".jpeg",
	".svg",
	".gif",
	".woff",
	".woff2",
	".ttf",
	".eot",
];

const AUTH_PAGES = [
	AppRoutePaths.SignIn,
	AppRoutePaths.SignUp,
	AppRoutePaths.ForgotPassword,
	AppRoutePaths.CheckRole,
];

const FREELANCER_PATHS = [
	AppRoutePaths.FreelancerDashboard.Home,
	AppRoutePaths.FreelancerDashboard.Notifications,
	AppRoutePaths.FreelancerDashboard.Projects.Home,
	AppRoutePaths.FreelancerDashboard.Workers.Home,
	AppRoutePaths.FreelancerDashboard.Payments.Home,
];

const CONTRACTOR_PATHS = [
	AppRoutePaths.ContractorDashboard.Home,
	AppRoutePaths.ContractorDashboard.Notifications,
	AppRoutePaths.ContractorDashboard.Projects.Home,
	AppRoutePaths.ContractorDashboard.Workers.Home,
	AppRoutePaths.ContractorDashboard.Payments.Home,
];

function isAuthPage(pathname: string) {
	return AUTH_PAGES.includes(pathname);
}

function isFreelancerPage(pathname: string) {
	return FREELANCER_PATHS.some((p) => pathname.startsWith(p));
}

function isContractorPage(pathname: string) {
	return CONTRACTOR_PATHS.some((p) => pathname.startsWith(p));
}

function isDashboardPage(pathname: string) {
	return isFreelancerPage(pathname) || isContractorPage(pathname);
}

export default auth(async (req) => {
	const { pathname, origin, search } = req.nextUrl;

	if (ASSET_EXTENSIONS.some((ext) => pathname.endsWith(ext))) {
		return NextResponse.next();
	}

	if (isAuthPage(pathname) && req.auth?.user) {
		const role = req.auth.user.role;
		if (role === "Freelancer") {
			return NextResponse.redirect(
				new URL(AppRoutePaths.FreelancerDashboard.Home, origin),
			);
		}
		if (role === "Contractor") {
			return NextResponse.redirect(
				new URL(AppRoutePaths.ContractorDashboard.Home, origin),
			);
		}

		return NextResponse.redirect(new URL(AppRoutePaths.Index, origin));
	}

	// If on the home page, redirect to dashboard if logged in, else to login
	if (pathname === AppRoutePaths.Index || pathname === "/") {
		if (req.auth?.user) {
			const role = req.auth.user.role;
			if (role === "Freelancer") {
				return NextResponse.redirect(
					new URL(AppRoutePaths.FreelancerDashboard.Home, origin),
				);
			}
			if (role === "Contractor") {
				return NextResponse.redirect(
					new URL(AppRoutePaths.ContractorDashboard.Home, origin),
				);
			}
		} else {
			return NextResponse.redirect(new URL(AppRoutePaths.SignIn, origin));
		}
	}

	// If trying to access a dashboard page but not logged in, redirect to login with callbackUrl
	if (isDashboardPage(pathname) && !req.auth?.user) {
		const redirectUrl = new URL(AppRoutePaths.SignIn, origin);
		redirectUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
		return NextResponse.redirect(redirectUrl);
	}

	// If logged in, enforce role-based access to dashboards
	if (req.auth?.user) {
		const role = req.auth.user.role;
		if (isFreelancerPage(pathname) && role !== "Freelancer") {
			// Contractor trying to access freelancer page
			return NextResponse.redirect(
				new URL(AppRoutePaths.ContractorDashboard.Home, origin),
			);
		}
		if (isContractorPage(pathname) && role !== "Contractor") {
			// Freelancer trying to access contractor page
			return NextResponse.redirect(
				new URL(AppRoutePaths.FreelancerDashboard.Home, origin),
			);
		}
	}

	// If not logged in and not on an auth page, allow access only to public pages (add more if needed)
	// (If you want to restrict all non-auth pages, add logic here)

	return NextResponse.next();
});

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon\\.ico|assets|images|fonts|css|public).*)",
	],
};
