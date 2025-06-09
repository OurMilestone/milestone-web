export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US").format(amount);
}
export function formatDate(date: Date | string): string {
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	return new Date(date).toLocaleDateString("en-US", options);
}
