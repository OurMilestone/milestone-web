"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function TestimonialsSection() {
	return (
		<section id="testimonials" className="bg-white py-20 sm:py-24 lg:py-28">
			<div className="ms-container">
				<div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="ms-h2 max-w-xl"
					>
						Why teams trust Milestone with their contractors.
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.08 }}
						className="ms-body max-w-md lg:justify-self-end lg:pt-2 lg:text-right"
					>
						Feedback from companies who run contracts, work, and payments in one
						place — with clearer visibility from kickoff to payout.
					</motion.p>
				</div>

				<div className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-[1.85fr_1fr] lg:gap-6">
					<motion.article
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[1.25rem] bg-[#14181f] p-6 sm:min-h-[400px] sm:p-8 lg:min-h-[440px]"
					>
						<p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/80">
							User Story
						</p>

						<div className="flex items-end justify-between gap-4">
							<div className="max-w-md">
								<blockquote className="text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl lg:text-[1.65rem]">
									“Milestone gave us one place to track contracts, work, and
									payments — without the spreadsheet chaos.”
								</blockquote>
								<p className="mt-3 text-sm font-medium text-white/85">
									Ada Okonkwo
								</p>
							</div>

							<button
								type="button"
								aria-label="Play user story"
								className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/90 text-[var(--ms-navy)] shadow-sm backdrop-blur-sm transition hover:bg-white sm:size-14"
							>
								<Play className="ml-0.5 size-5 fill-current sm:size-6" />
							</button>
						</div>
					</motion.article>

					<motion.article
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="flex min-h-[280px] flex-col justify-between rounded-[1.25rem] bg-[#2f5bff] p-6 text-white sm:min-h-[320px] sm:p-8 lg:min-h-[440px]"
					>
						<p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/70">
							Fact &amp; Number
						</p>

						<div>
							<p className="text-[clamp(4.5rem,10vw,6.5rem)] font-semibold leading-none tracking-[-0.04em]">
								90%
							</p>
							<p className="mt-5 max-w-[16rem] text-base leading-relaxed text-white/85">
								of teams say they approve milestones faster with clear work
								visibility in Milestone.
							</p>
						</div>
					</motion.article>
				</div>
			</div>
		</section>
	);
}
