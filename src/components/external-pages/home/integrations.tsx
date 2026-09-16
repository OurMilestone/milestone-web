"use client";

import { motion } from "framer-motion";

type Integration = {
	name: string;
	src: string;
};

const integrations: Integration[] = [
	{ name: "GitHub", src: "/assets/svgs/integrations/github.svg" },
	{ name: "Slack", src: "/assets/svgs/integrations/slack.svg" },
	{ name: "Linear", src: "/assets/svgs/integrations/linear.svg" },
	{ name: "Figma", src: "/assets/svgs/integrations/figma.svg" },
	{ name: "Google Drive", src: "/assets/svgs/integrations/google-drive.svg" },
	{
		name: "Google Calendar",
		src: "/assets/svgs/integrations/google-calendar.svg",
	},
];

const rowA = integrations.slice(0, 3);
const rowB = integrations.slice(3);

function LogoChip({ name, src }: Integration) {
	return (
		<div className="flex shrink-0 items-center gap-3 px-5 py-3.5 sm:px-6">
			<span className="relative flex size-8 shrink-0 items-center justify-center">
				<img
					src={src}
					alt=""
					width={28}
					height={28}
					className="size-7 object-contain"
				/>
			</span>
			<span className="whitespace-nowrap text-sm font-medium tracking-tight text-[var(--ms-navy)]">
				{name}
			</span>
		</div>
	);
}

function MarqueeRow({
	items,
	reverse = false,
}: {
	items: Integration[];
	reverse?: boolean;
}) {
	const loop = [...items, ...items, ...items];
	return (
		<div className="ms-marquee-mask relative overflow-hidden">
			<div
				className={`ms-marquee-track flex w-max items-center ${
					reverse ? "ms-marquee-reverse" : ""
				}`}
			>
				{loop.map((item, i) => (
					<div key={`${item.name}-${i}`} className="flex items-center">
						<LogoChip {...item} />
						<span
							aria-hidden
							className="h-7 w-px shrink-0 bg-[var(--ms-border)]"
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default function IntegrationsSection() {
	return (
		<section
			id="integrations"
			className="overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
		>
			<div className="ms-container">
				<div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
					<div className="max-w-xl">
						<motion.p
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="ms-eyebrow"
						>
							Integrations
						</motion.p>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.05 }}
							className="ms-h2 mt-3"
						>
							Works with the tools your teams already use.
						</motion.h2>
					</div>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="ms-body max-w-md lg:justify-self-end lg:pb-1"
					>
						Milestone doesn&apos;t replace the tools where work happens. It
						connects them — from project apps to payments.
					</motion.p>
				</div>
			</div>

			<ul className="sr-only">
				{integrations.map((item) => (
					<li key={item.name}>{item.name}</li>
				))}
			</ul>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ delay: 0.12, duration: 0.5 }}
				className="ms-integrations-marquee mt-14 sm:mt-16"
			>
				<div className="space-y-0 border-y border-[var(--ms-border)] bg-[var(--ms-surface)] py-4 sm:py-5">
					<MarqueeRow items={rowA} />
					<div className="my-1 h-px bg-[var(--ms-border)]" />
					<MarqueeRow items={rowB} reverse />
				</div>
			</motion.div>

			<div className="ms-integrations-static ms-container mt-12 hidden">
				<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 border-y border-[var(--ms-border)] bg-[var(--ms-surface)] px-4 py-8">
					{integrations.map((item) => (
						<div key={item.name} className="flex items-center gap-2.5">
							<img
								src={item.src}
								alt=""
								width={24}
								height={24}
								className="size-6 object-contain"
							/>
							<span className="text-sm font-medium text-[var(--ms-navy)]">
								{item.name}
							</span>
						</div>
					))}
				</div>
			</div>

			<div className="ms-container mt-10 sm:mt-12">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[var(--ms-muted)] sm:justify-between"
				>
					<p>Work tools, collaboration, and accounting — linked in one flow.</p>
					<p className="font-medium text-[var(--ms-navy)]">
						{integrations.length}+ integrations and growing
					</p>
				</motion.div>
			</div>
		</section>
	);
}
