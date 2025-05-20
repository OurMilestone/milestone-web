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

		const user = session?.user;
		const callbackUrl = searchParams.get("callbackUrl");

		const isFreelancerPath = (path: string) =>
			path?.startsWith(
				AppRoutePaths.FreelancerDashboard.Home.replace("/overview", ""),
			);
		const isContractorPath = (path: string) =>
			path?.startsWith(
				AppRoutePaths.ContractorDashboard.Home.replace("/overview", ""),
			);

		if (!user) {
			router.replace(AppRoutePaths.SignIn);
			return;
		}
		if (callbackUrl) {
			if (
				(user.role === "Freelancer" && isFreelancerPath(callbackUrl)) ||
				(user.role === "Contractor" && isContractorPath(callbackUrl))
			) {
				router.replace(callbackUrl);
				return;
			}
		}

		if (user.role === "Freelancer") {
			router.replace(AppRoutePaths.FreelancerDashboard.Home);
		} else if (user.role === "Contractor") {
			router.replace(AppRoutePaths.ContractorDashboard.Home);
		} else {
			router.replace(AppRoutePaths.SignIn);
		}
	}, [session, status, router, searchParams]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Loader className="h-8 w-8 text-primary animate-spin" />
		</div>
	);
};

export default PostLoginRedirect;
