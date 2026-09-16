"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { ReactNode } from "react";

function Highlight({ children }: { children: ReactNode }) {
	return (
		<span className="box-decoration-clone bg-[#f8e45c] px-1.5 py-[0.12em] text-[var(--ms-ink)] [box-decoration-break:clone]">
			{children}
		</span>
	);
}

export default function DisputeSection() {
	return (
		<section
			id="dispute"
			className="bg-[var(--ms-surface)] py-16 sm:py-20 lg:py-24"
		>
			<div className="ms-container">
				<motion.div
					initial={{ opacity: 0, y: 28 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.55 }}
					className="overflow-hidden rounded-[2rem] bg-black p-8 sm:rounded-[2.5rem] sm:p-10 lg:p-14"
				>
					<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
						{/* Left — quote & copy */}
						<div className="flex flex-col">
							<span
								aria-hidden
								className="select-none text-6xl font-serif leading-none text-white/90 sm:text-7xl"
							>
								&ldquo;
							</span>

							<blockquote className="mt-2 text-[1.35rem] font-semibold leading-[1.35] tracking-tight text-white sm:text-2xl lg:text-[1.75rem] lg:leading-[1.35]">
								When a dispute arises between the client and service provider,{" "}
								<Highlight>
									Milestone&apos;s experienced dispute resolution team
								</Highlight>{" "}
								steps in to facilitate a{" "}
								<Highlight>fair and structured resolution.</Highlight>
							</blockquote>

							<p className="mt-6 max-w-lg text-sm leading-relaxed text-white/55 sm:text-[0.9375rem]">
								Our team reviews the project, the agreed milestones, submitted
								deliverables, and relevant communication to understand the issue
								and help both parties reach a resolution. The goal is to resolve
								the dispute efficiently, protect both parties, and ensure that
								the project can move forward to successful completion.
							</p>

							<div className="mt-10">
								{/* Avatar placeholder */}
								<div
									aria-hidden
									className="h-12 w-12 rounded-full bg-[#3d4659]"
								/>
								<p className="mt-3 text-sm font-semibold text-white">
									Dispute Resolution Team
								</p>
								<p className="mt-0.5 text-xs text-white/55">
									Milestone · Client &amp; contractor support
								</p>
								<p className="mt-1 max-w-xs text-xs text-white/40">
									Protecting both sides so projects can move forward.
								</p>
							</div>
						</div>

						{/* Right — video placeholder */}
						<div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#2a3142] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[380px]">
							{/* Media color placeholder */}
							<div
								aria-hidden
								className="absolute inset-0 bg-gradient-to-br from-[#3a455c] via-[#2a3142] to-[#1a2030]"
							/>

							{/* Play button */}
							<button
								type="button"
								aria-label="Play dispute resolution overview"
								className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-[#b8f000] text-black shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8f000] sm:h-[4.5rem] sm:w-[4.5rem]"
							>
								<Play className="h-7 w-7 fill-current" strokeWidth={0} />
							</button>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
