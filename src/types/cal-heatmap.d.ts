declare module "cal-heatmap" {
	import type { PluginFunc } from "dayjs";

	export type PluginDefinition = [
		new (...args: unknown[]) => unknown,
		Record<string, unknown>?,
	];

	export default class CalHeatmap {
		paint(
			options?: Record<string, unknown>,
			plugins?: PluginDefinition[] | PluginDefinition,
		): Promise<unknown>;
		destroy(): Promise<unknown>;
		fill(dataSource?: unknown): Promise<unknown>;
		extendDayjs(plugin: PluginFunc): unknown;
	}
}

declare module "cal-heatmap/plugins/Tooltip" {
	const Tooltip: new (...args: unknown[]) => unknown;
	export default Tooltip;
}

declare module "cal-heatmap/plugins/LegendLite" {
	const LegendLite: new (...args: unknown[]) => unknown;
	export default LegendLite;
}

declare module "cal-heatmap/plugins/Legend" {
	const Legend: new (...args: unknown[]) => unknown;
	export default Legend;
}

declare module "cal-heatmap/plugins/CalendarLabel" {
	const CalendarLabel: new (...args: unknown[]) => unknown;
	export default CalendarLabel;
}

declare module "cal-heatmap/cal-heatmap.css";
