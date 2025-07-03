export default function PaymentsPageHeader() {
	return (
		<div>
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="flex items-center">
					<div>
						<h1 className="text-2xl md:text-3xl font-medium text-slate-800 dark:text-slate-100">
							Payments
						</h1>
						<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
							Track your active projects, milestones and payments
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
