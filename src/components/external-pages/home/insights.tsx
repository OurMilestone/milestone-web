"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Check } from "lucide-react";
import { useState } from "react";

const problems = [
	{ label: "Delayed project milestones", solution: 0 },
	{ label: "Missed approval windows", solution: 1 },
	{ label: "Contracts nearing renewal", solution: 4 },
	{ label: "Unclear payment status", solution: 3 },
	{ label: "Scattered contractor updates", solution: 0 },
	{ label: "Behind-schedule deliverables", solution: 0 },
	{ label: "Manual status chasing", solution: 2 },
	{ label: "Hidden delivery risks", solution: 2 },
	{ label: "Late renewal reminders", solution: 4 },
	{ label: "Unreviewed milestone submissions", solution: 1 },
	{ label: "Cashflow surprises", solution: 3 },
	{ label: "Silent project drift", solution: 0 },
] as const;

const solutions = [
	"Real-time project health signals",
	"Approval queue visibility",
	"Automated delay & risk alerts",
	"Expected payment intelligence",
	"Contract renewal reminders",
] as const;

export default function InsightsSection() {
	const [activeProblem, setActiveProblem] = useState(4);
	const activeSolution = problems[activeProblem]?.solution ?? 2;

	return (
		<section id="insights" className="bg-[#f7f7f8] py-20 sm:py-24 lg:py-28">
			<div className="ms-container">
				<div className="mx-auto max-w-4xl text-center">
					<motion.span
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="inline-flex rounded-full border border-[#e5e7eb] bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]"
					>
						Problem &amp; Solutions
					</motion.span>

					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.05 }}
						className="mt-6 text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--ms-navy)] sm:text-[2.35rem] lg:text-[2.75rem]"
					>
						See what needs your attention before it{" "}
						<span className="text-[var(--ms-muted)]">
							becomes a delay, a missed approval, or a late renewal.
						</span>
					</motion.h2>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 28 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.55, delay: 0.1 }}
					className="relative mx-auto mt-14 max-w-6xl lg:mt-16"
				>
					{/* Connector lines — desktop */}
					<svg
						aria-hidden
						className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
						viewBox="0 0 1000 520"
						preserveAspectRatio="none"
					>
						{[
							"M 380 120 C 460 120, 520 150, 600 160",
							"M 340 210 C 450 210, 530 220, 600 240",
							"M 360 300 C 470 300, 540 290, 600 300",
							"M 320 380 C 450 380, 530 350, 600 360",
						].map((d) => (
							<path
								key={d}
								d={d}
								fill="none"
								stroke="#d1d5db"
								strokeWidth="1.25"
								strokeOpacity="0.7"
							/>
						))}
					</svg>

					<div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-12">
						{/* Problems */}
						<div className="relative z-10">
							<div className="mb-6 flex items-center gap-2.5">
								<span className="flex size-7 items-center justify-center rounded-md bg-[#ef4444] text-white shadow-sm">
									<AlertTriangle className="size-3.5" strokeWidth={2.5} />
								</span>
								<span className="text-base font-semibold text-[#ef4444]">
									Problem
								</span>
							</div>

							<div className="flex flex-wrap content-start gap-2.5 sm:gap-3">
								{problems.map((problem, index) => {
									const isActive = index === activeProblem;
									return (
										<button
											key={problem.label}
											type="button"
											onMouseEnter={() => setActiveProblem(index)}
											onFocus={() => setActiveProblem(index)}
											onClick={() => setActiveProblem(index)}
											className={`rounded-xl border bg-white px-3.5 py-2.5 text-left text-sm transition-all duration-200 sm:px-4 sm:py-3 ${
												isActive
													? "z-10 border-[#cfd3da] text-[var(--ms-navy)] shadow-[0_10px_28px_rgb(17_24_39/0.12)]"
													: "border-[#e8eaee] text-[#6b7280] shadow-[0_1px_2px_rgb(17_24_39/0.03)] hover:border-[#d5d8de] hover:text-[var(--ms-navy)] hover:shadow-[0_8px_20px_rgb(17_24_39/0.08)]"
											}`}
										>
											{problem.label}
										</button>
									);
								})}
							</div>
						</div>

						{/* Solutions */}
						<div className="relative z-10 overflow-hidden rounded-[1.75rem] bg-[var(--ms-navy)] px-5 py-7 shadow-[0_24px_60px_rgb(12_21_60/0.28)] sm:px-7 sm:py-8 lg:min-h-[420px]">
							{/* Subtle circuit-like backdrop */}
							<svg
								aria-hidden
								className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
								viewBox="0 0 400 520"
								preserveAspectRatio="xMidYMid slice"
							>
								{[
									"M20 80 H120 V180 H220",
									"M60 260 H180 V340 H300",
									"M40 420 H160 V480",
									"M280 60 V140 H360",
									"M250 220 H360 V300",
								].map((d) => (
									<path
										key={d}
										d={d}
										fill="none"
										stroke="#94a3b8"
										strokeWidth="1"
									/>
								))}
								{[
									[120, 80],
									[220, 180],
									[180, 260],
									[300, 340],
									[160, 420],
									[280, 140],
									[360, 300],
								].map(([cx, cy]) => (
									<circle
										key={`${cx}-${cy}`}
										cx={cx}
										cy={cy}
										r="2.5"
										fill="#94a3b8"
									/>
								))}
							</svg>

							<div className="relative mb-7 flex items-center gap-2.5">
								<span className="flex size-7 items-center justify-center rounded-md bg-[#3b82f6] text-white shadow-sm">
									<Check className="size-3.5" strokeWidth={3} />
								</span>
								<span className="text-base font-semibold text-[#60a5fa]">
									Solutions
								</span>
							</div>

							<ul className="relative space-y-3">
								{solutions.map((solution, index) => {
									const isActive = index === activeSolution;
									return (
										<li key={solution}>
											<motion.div
												layout
												className={`relative flex items-center justify-center rounded-2xl px-4 py-3.5 text-center text-sm font-medium transition-colors duration-300 sm:px-5 sm:py-4 sm:text-[0.95rem] ${
													isActive
														? "bg-[#3b82f6] text-white shadow-[0_12px_32px_rgb(59_130_246/0.45)]"
														: "border border-white/15 bg-white/[0.04] text-white/85"
												}`}
											>
												<span
													aria-hidden
													className={`absolute left-0 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
														isActive ? "bg-white" : "bg-white/35"
													}`}
												/>
												<span
													aria-hidden
													className={`absolute right-0 top-1/2 size-2 -translate-y-1/2 translate-x-1/2 rounded-full ${
														isActive ? "bg-white" : "bg-white/35"
													}`}
												/>
												{solution}
											</motion.div>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
