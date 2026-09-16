"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type HeatmapDatum = { date: string; value: number };

function generateYearlyData(year: number): HeatmapDatum[] {
	const data: HeatmapDatum[] = [];
	const start = new Date(Date.UTC(year, 0, 1));
	const end = new Date(Date.UTC(year, 11, 31));

	for (
		let cursor = new Date(start);
		cursor <= end;
		cursor.setUTCDate(cursor.getUTCDate() + 1)
	) {
		const day = cursor.getUTCDay();
		const isWeekend = day === 0 || day === 6;
		const seed =
			cursor.getUTCFullYear() * 10000 +
			(cursor.getUTCMonth() + 1) * 100 +
			cursor.getUTCDate();
		const noise = (Math.sin(seed) + 1) / 2;
		const base = isWeekend ? noise * 2 : noise * 8;
		const value = Math.round(base);

		if (value > 0) {
			data.push({
				date: cursor.toISOString().slice(0, 10),
				value,
			});
		}
	}

	return data;
}

const HEATMAP_COLORS = ["#E8F1FB", "#B6D4F5", "#5B9FE3", "#2F6FBF", "#1B4F8A"];

export function ProductivityHeatmap() {
	const reactId = useId();
	const calendarId = `cal-heatmap-${reactId.replace(/:/g, "")}`;
	const legendId = `cal-legend-${reactId.replace(/:/g, "")}`;
	const calendarRef = useRef<HTMLDivElement>(null);
	const [range, setRange] = useState("yearly");
	const [isReady, setIsReady] = useState(false);

	const year = useMemo(() => new Date().getFullYear(), []);
	const heatmapData = useMemo(() => generateYearlyData(year), [year]);

	useEffect(() => {
		let cancelled = false;
		let calInstance: { destroy: () => Promise<unknown> } | null = null;

		async function paintHeatmap() {
			if (!calendarRef.current) return;

			const [
				{ default: CalHeatmap },
				{ default: Tooltip },
				{ default: LegendLite },
				{ default: CalendarLabel },
			] = await Promise.all([
				import("cal-heatmap"),
				import("cal-heatmap/plugins/Tooltip"),
				import("cal-heatmap/plugins/LegendLite"),
				import("cal-heatmap/plugins/CalendarLabel"),
			]);

			await import("cal-heatmap/cal-heatmap.css");

			if (cancelled || !calendarRef.current) return;

			calendarRef.current.innerHTML = "";
			const legendEl = document.getElementById(legendId);
			if (legendEl) legendEl.innerHTML = "";

			const cal = new CalHeatmap();
			calInstance = cal;

			const monthCount = range === "yearly" ? 12 : 3;
			const start =
				range === "yearly"
					? new Date(year, 0, 1)
					: new Date(year, Math.max(0, new Date().getMonth() - 2), 1);

			await cal.paint(
				{
					itemSelector: `#${calendarId}`,
					domain: {
						type: "month",
						gutter: 8,
						label: {
							text: "MMM",
							textAlign: "start",
							position: "bottom",
						},
					},
					subDomain: {
						type: "ghDay",
						radius: 2,
						width: 12,
						height: 12,
						gutter: 3,
					},
					date: {
						start,
						locale: "en",
					},
					range: monthCount,
					data: {
						source: heatmapData,
						type: "json",
						x: "date",
						y: "value",
						groupY: "max",
					},
					scale: {
						color: {
							type: "threshold",
							range: HEATMAP_COLORS,
							domain: [1, 3, 5, 7],
						},
					},
					theme: "light",
				},
				[
					[
						Tooltip,
						{
							text: (
								_timestamp: number,
								value: number | null,
								dayjsDate: { format: (fmt: string) => string },
							) =>
								`${value ? value : "No"} contribution${value === 1 ? "" : "s"} on ${dayjsDate.format("LL")}`,
						},
					],
					[
						LegendLite,
						{
							includeBlank: true,
							itemSelector: `#${legendId}`,
							radius: 2,
							width: 11,
							height: 11,
							gutter: 4,
						},
					],
					[
						CalendarLabel,
						{
							width: 24,
							textAlign: "start",
							text: () => ["M", "T", "W", "T", "F", "S", "S"],
							padding: [0, 8, 0, 0],
						},
					],
				],
			);

			if (!cancelled) setIsReady(true);
		}

		setIsReady(false);
		void paintHeatmap();

		return () => {
			cancelled = true;
			void calInstance?.destroy();
		};
	}, [calendarId, heatmapData, legendId, range, year]);

	return (
		<section className="rounded-xl border border-[#E8EAED] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
			<div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h2 className="text-base font-semibold text-[#101828]">
						Monthly Productivity Overview
					</h2>
					<p className="mt-1 text-sm text-[#667085]">
						Track task progress and completion rates over time.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-4">
					<div className="flex items-center gap-2 text-xs text-[#667085]">
						<span>Less</span>
						<div id={legendId} className="flex items-center" />
						<span>More</span>
					</div>
					<Select value={range} onValueChange={setRange}>
						<SelectTrigger className="h-9 w-[110px] rounded-lg border-[#E8EAED] bg-white text-sm">
							<SelectValue placeholder="Yearly" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="yearly">Yearly</SelectItem>
							<SelectItem value="quarterly">Quarterly</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="relative w-full overflow-x-auto pb-1">
				{!isReady && (
					<div className="absolute inset-0 z-10 flex min-h-[140px] items-center justify-center rounded-lg bg-white/70 text-sm text-[#98A2B3]">
						Loading heatmap…
					</div>
				)}
				<div
					id={calendarId}
					ref={calendarRef}
					className="min-h-[140px] w-max max-w-full"
				/>
			</div>
		</section>
	);
}
