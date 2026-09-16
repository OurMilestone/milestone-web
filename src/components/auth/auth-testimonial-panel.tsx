"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const testimonials = [
	{
		quote:
			"Milestone gave us one place to track contracts, work, and payments — without the spreadsheet chaos.",
		name: "Ada Okonkwo",
		role: "Operations Lead, Northwind Labs",
		company: "Product Studio",
		image: "https://ik.imagekit.io/lbmbhaciz/IMG_3095.JPG.jpeg",
		position: "center 20%",
	},
	{
		quote:
			"We move faster than our peers and stay consistent. Approvals, deliverables, and payouts finally live in one workflow.",
		name: "Sophie Hall",
		role: "Founder, Catalog",
		company: "Web Design Agency",
		image: "https://ik.imagekit.io/lbmbhaciz/IMG_3093.JPG.jpeg",
		position: "center",
	},
	{
		quote:
			"From contract to payment, Milestone keeps our contractor work visible and accountable — for both sides.",
		name: "James Okoro",
		role: "Head of Partnerships",
		company: "Growth Collective",
		image: "https://ik.imagekit.io/lbmbhaciz/IMG_3098.JPG.jpeg",
		position: "center",
	},
];

export default function AuthTestimonialPanel() {
	const [index, setIndex] = useState(0);
	const active = testimonials[index];

	const prev = () =>
		setIndex((current) =>
			current === 0 ? testimonials.length - 1 : current - 1,
		);
	const next = () =>
		setIndex((current) =>
			current === testimonials.length - 1 ? 0 : current + 1,
		);

	return (
		<aside className="relative hidden h-dvh overflow-hidden md:block">
			<AnimatePresence mode="wait">
				<motion.div
					key={active.image}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.45 }}
					className="absolute inset-0"
				>
					<Image
						src={active.image}
						alt=""
						fill
						priority
						sizes="50vw"
						className="object-cover"
						style={{ objectPosition: active.position }}
					/>
				</motion.div>
			</AnimatePresence>

			{/* Soft overlays for readability */}
			<div
				aria-hidden
				className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
			/>

			<div className="relative z-10 flex h-full flex-col justify-end p-10 xl:p-12">
				<blockquote className="max-w-xl text-[1.65rem] font-semibold leading-[1.25] tracking-[-0.02em] text-white xl:text-[1.85rem]">
					“{active.quote}”
				</blockquote>

				<div className="mt-8 flex items-end justify-between gap-6">
					<div>
						<p className="text-base font-semibold text-white">{active.name}</p>
						<p className="mt-1 text-sm text-white/75">{active.role}</p>
						<p className="text-sm text-white/60">{active.company}</p>
					</div>

					<div className="flex flex-col items-end gap-4">
						<div className="flex items-center gap-1">
							{["a", "b", "c", "d", "e"].map((id) => (
								<Star key={id} className="size-4 fill-white text-white" />
							))}
						</div>

						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={prev}
								aria-label="Previous testimonial"
								className="flex size-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
							>
								<ChevronLeft className="size-4" />
							</button>
							<button
								type="button"
								onClick={next}
								aria-label="Next testimonial"
								className="flex size-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
							>
								<ChevronRight className="size-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}
