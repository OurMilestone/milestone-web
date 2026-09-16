import AuthTestimonialPanel from "@/components/auth/auth-testimonial-panel";
import Link from "next/link";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<main className="min-h-dvh grid bg-white md:grid-cols-2">
			<section className="relative flex min-h-dvh flex-col px-6 py-8 sm:px-10 lg:px-14 xl:px-20">
				<Link
					href="/"
					className="mb-10 inline-flex w-fit shrink-0 text-[1.125rem] font-semibold tracking-tight text-[#101828] sm:mb-12"
				>
					Milestone
				</Link>

				<div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center pb-8">
					{children}
				</div>
			</section>

			<AuthTestimonialPanel />
		</main>
	);
}
