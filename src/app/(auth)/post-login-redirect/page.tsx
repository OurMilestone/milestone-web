"use client";

import { AppRoutePaths } from "@/config/routes-config";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";

const PostLoginRedirect = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (status === "loading") return;

		const callbackUrlFromQuery = searchParams.get("callbackUrl");

		if (status === "unauthenticated") {
			router.replace(AppRoutePaths.SignIn);
			return;
		}

		if (status === "authenticated" && session?.user) {
			const user = session.user;

			const isFreelancerPath = (path: string | null) =>
				path?.startsWith(
					AppRoutePaths.FreelancerDashboard.Home.split("/overview")[0],
				);
			const isContractorPath = (path: string | null) =>
				path?.startsWith(
					AppRoutePaths.ContractorDashboard.Home.split("/overview")[0],
				);

			if (callbackUrlFromQuery) {
				if (
					(user.role === "Freelancer" &&
						isFreelancerPath(callbackUrlFromQuery)) ||
					(user.role === "Contractor" && isContractorPath(callbackUrlFromQuery))
				) {
					console.log(
						"PostLoginRedirect: Valid callbackUrl for role, redirecting to:",
						callbackUrlFromQuery,
					);
					router.replace(callbackUrlFromQuery);
					return;
					// biome-ignore lint/style/noUselessElse: <explanation>
				} else {
					console.warn(
						"PostLoginRedirect: callbackUrl role mismatch or invalid. Falling back to default dashboard.",
					);
				}
			}

			if (user.role === "Freelancer") {
				console.log("PostLoginRedirect: Redirecting Freelancer to dashboard.");
				router.replace(AppRoutePaths.FreelancerDashboard.Home);
			} else if (user.role === "Contractor") {
				console.log("PostLoginRedirect: Redirecting Contractor to dashboard.");
				router.replace(AppRoutePaths.ContractorDashboard.Home);
			} else {
				console.warn(
					"PostLoginRedirect: Unknown user role, redirecting to sign-in.",
				);
				router.replace(AppRoutePaths.SignIn);
			}
		}
	}, [session, status, router, searchParams]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Loader className="h-8 w-8 text-primary animate-spin" />
		</div>
	);
};

export default PostLoginRedirect;
