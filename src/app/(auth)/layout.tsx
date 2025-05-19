import Image from "next/image";
import {
	ImAuthBackground,
	ImFullTextLogo,
} from "../../../public/assets/images/__index__";

interface AuthLayoutProps {
	children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<main className="min-h-dvh grid md:grid-cols-2">
			<aside className="sticky top-0 h-dvh hidden md:block">
				<Image
					src={ImAuthBackground}
					alt="Get your milestone account"
					className="h-full w-full object-cover absolute top-0 left-0"
					width={569}
					height={1024}
				/>
				<section className="relative z-[1] p-10 h-full flex flex-col">
					<div className="mt-auto mb-6">
						<h1 className="text-5xl text-white font-light leading-tight">
							Connect, collaborate, and grow your career with ease.
						</h1>

						<p className="text-white/70 font-light  leading-8 mt-6 text-lg">
							Milestone makes sure the money flows smoothly and safely between
							workers and clients, while taking care of all the tricky stuff
							behind the scenes — kind of like a trusted middleman.
						</p>
					</div>
				</section>
			</aside>

			<section className="m-auto rounded-xl px-8 pb-8 pt-10 relative z-10 h-min w-full max-w-lg">
				<Image
					src={ImFullTextLogo}
					alt="milestone.com"
					className="mb-14 mx-auto"
				/>
				{children}
			</section>
		</main>
	);
}
