"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const avatars = [
	"/assets/svgs/memojis/hero-avatar-1.svg",
	"/assets/svgs/memojis/hero-avatar-2.svg",
	"/assets/svgs/memojis/hero-avatar-3.svg",
	"/assets/svgs/memojis/hero-avatar-4.svg",
];

const bentoImages = {
	handshake: "https://ik.imagekit.io/lbmbhaciz/IMG_3093.JPG.jpeg",
	portrait: "https://ik.imagekit.io/lbmbhaciz/IMG_3095.JPG.jpeg",
	globe: "https://ik.imagekit.io/lbmbhaciz/IMG_3098.JPG.jpeg",
	currency: "https://ik.imagekit.io/lbmbhaciz/IMG_3096.JPG.jpeg",
	clipboard: "https://ik.imagekit.io/lbmbhaciz/IMG_3097.JPG.jpeg",
};

function BentoCard({
	color,
	image,
	fit = "cover",
	position = "center",
	className,
}: {
	color: string;
	image?: string;
	fit?: "cover" | "contain";
	position?: string;
	className?: string;
}) {
	return (
		<div
			className={`relative overflow-hidden rounded-[1.5rem] ${className ?? ""}`}
			style={{ background: color }}
		>
			{image ? (
				<Image
					src={image}
					alt=""
					fill
					sizes="(max-width: 1024px) 45vw, 280px"
					className={
						fit === "contain" ? "object-contain p-3 sm:p-4" : "object-cover"
					}
					style={fit === "cover" ? { objectPosition: position } : undefined}
				/>
			) : null}
		</div>
	);
}

function HeroBento() {
	return (
		<div className="relative h-[560px] sm:h-[620px] lg:h-[700px]">
			<div
				className="absolute inset-0 grid grid-cols-2 gap-3.5 sm:gap-4"
				style={{
					WebkitMaskImage:
						"linear-gradient(to bottom, transparent 0%, transparent 6%, rgba(0,0,0,0.2) 14%, rgba(0,0,0,0.55) 24%, black 38%, black 68%, rgba(0,0,0,0.55) 85%, transparent 100%)",
					maskImage:
						"linear-gradient(to bottom, transparent 0%, transparent 6%, rgba(0,0,0,0.2) 14%, rgba(0,0,0,0.55) 24%, black 38%, black 68%, rgba(0,0,0,0.55) 85%, transparent 100%)",
				}}
			>
				{/* Left track */}
				<div className="flex min-h-0 flex-col gap-3.5 sm:gap-4">
					<BentoCard color="#c8ced6" className="min-h-0 flex-1" />
					<BentoCard
						color="#2f5bff"
						image={bentoImages.handshake}
						fit="cover"
						position="center"
						className="min-h-0 flex-1"
					/>
					<BentoCard
						color="#e8c4a8"
						image={bentoImages.currency}
						fit="cover"
						position="center"
						className="min-h-0 flex-1"
					/>
				</div>

				{/* Right track — shifted down; same flex space keeps cards equal */}
				<div className="flex min-h-0 translate-y-10 flex-col gap-3.5 sm:translate-y-14 sm:gap-4 lg:translate-y-16">
					<BentoCard
						color="#e8eaed"
						image={bentoImages.globe}
						fit="cover"
						position="center"
						className="min-h-0 flex-1"
					/>
					<BentoCard
						color="#f0b429"
						image={bentoImages.portrait}
						fit="cover"
						position="center 20%"
						className="min-h-0 flex-1"
					/>
					<BentoCard
						color="#7d9b8a"
						image={bentoImages.clipboard}
						fit="cover"
						position="center"
						className="min-h-0 flex-1"
					/>
				</div>
			</div>

			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-white from-15% via-white/80 via-45% to-transparent sm:h-52"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-white from-10% via-white/50 via-45% to-transparent sm:h-44"
			/>
		</div>
	);
}

export default function Hero() {
	return (
		<section className="relative overflow-hidden bg-white pb-20 pt-8 sm:pb-24 sm:pt-10 lg:pb-28 lg:pt-12">
			<div className="ms-container">
				<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-16">
					<div className="max-w-xl">
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.45 }}
							className="flex flex-wrap items-center gap-3"
						>
							<div className="flex items-center -space-x-2.5">
								{avatars.map((src, i) => (
									<span
										key={src}
										className="relative inline-flex size-10 shrink-0 overflow-hidden rounded-full bg-[#f3f4f6] ring-2 ring-white"
										style={{ zIndex: i + 1 }}
									>
										<img
											src={src}
											alt=""
											width={40}
											height={40}
											className="size-full object-cover object-center"
										/>
									</span>
								))}
							</div>
							<p className="max-w-[16rem] text-sm leading-snug text-[#6b7280] sm:max-w-none">
								Trusted by companies managing contractors worldwide.
							</p>
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.06 }}
							className="mt-7 text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[#111827] sm:text-5xl lg:text-[3.15rem] xl:text-[3.4rem]"
						>
							Manage contractors from contract to payment.
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.12 }}
							className="mt-5 max-w-md text-base leading-relaxed text-[#6b7280] sm:text-[1.0625rem]"
						>
							Milestone brings contractor contracts, project work, deliverables,
							approvals and payments into one place.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.18 }}
							className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
						>
							<Link
								href="/register"
								className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#111827] px-6 text-sm font-medium text-white shadow-[0_8px_24px_rgb(17_24_39/0.18)] transition-colors hover:bg-black"
							>
								Get started
								<ArrowUpRight className="size-4" />
							</Link>
							<a
								href="#platform"
								className="inline-flex h-12 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-6 text-sm font-medium text-[#111827] transition-colors hover:bg-[#f9fafb]"
							>
								See how it works
							</a>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.65, delay: 0.15 }}
						className="mx-auto w-full max-w-[540px] lg:mx-0 lg:max-w-none"
					>
						<HeroBento />
					</motion.div>
				</div>
			</div>
		</section>
	);
}
