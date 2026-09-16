export function HeroDashboardMock() {
	return (
		<div className="ms-mock">
			<div className="flex items-center gap-2 border-b border-[var(--ms-border)] bg-[var(--ms-surface-2)] px-4 py-3">
				<span className="size-2.5 rounded-full bg-[#e5e7eb]" />
				<span className="size-2.5 rounded-full bg-[#e5e7eb]" />
				<span className="size-2.5 rounded-full bg-[#e5e7eb]" />
				<span className="ml-3 text-xs text-[var(--ms-muted)]">
					app.milestone.com
				</span>
			</div>

			<div className="grid lg:grid-cols-[200px_1fr]">
				<aside className="hidden border-r border-[var(--ms-border)] bg-white p-4 lg:block">
					<p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--ms-muted)]">
						Workspace
					</p>
					<ul className="space-y-1 text-sm">
						{[
							"Overview",
							"Contractors",
							"Projects",
							"Milestones",
							"Payments",
							"Insights",
						].map((item, i) => (
							<li
								key={item}
								className={`rounded-md px-2.5 py-2 ${
									i === 0
										? "bg-[var(--ms-surface)] font-medium text-[var(--ms-navy)]"
										: "text-[var(--ms-muted)]"
								}`}
							>
								{item}
							</li>
						))}
					</ul>
				</aside>

				<div className="p-4 sm:p-6">
					<div className="mb-6">
						<p className="text-sm text-[var(--ms-muted)]">
							Good morning, Israel
						</p>
						<h3 className="mt-1 text-lg font-semibold text-[var(--ms-navy)] sm:text-xl">
							Your external workforce
						</h3>
					</div>

					<div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
						{[
							{ label: "Active Contractors", value: "18" },
							{ label: "Active Projects", value: "12" },
							{ label: "Awaiting Approval", value: "₦2.4m" },
							{ label: "Due This Week", value: "₦4.8m" },
						].map((stat) => (
							<div
								key={stat.label}
								className="rounded-lg border border-[var(--ms-border)] bg-white p-3 sm:p-4"
							>
								<p className="text-[11px] font-medium uppercase tracking-wide text-[var(--ms-muted)] sm:text-xs">
									{stat.label}
								</p>
								<p className="mt-2 text-xl font-semibold tracking-tight text-[var(--ms-navy)] sm:text-2xl">
									{stat.value}
								</p>
							</div>
						))}
					</div>

					<div>
						<p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ms-muted)]">
							Attention required
						</p>
						<div className="space-y-2">
							{[
								{
									badge: "Payment Ready",
									badgeClass: "bg-emerald-50 text-emerald-800",
									title: "Backend API Integration",
									meta: "John Adeyemi · ₦400,000",
								},
								{
									badge: "Project At Risk",
									badgeClass: "bg-amber-50 text-amber-800",
									title: "Website Redesign",
									meta: "4 days behind schedule",
								},
								{
									badge: "Contract Review",
									badgeClass: "bg-slate-100 text-slate-700",
									title: "New contractor agreement",
									meta: "Legal review requested",
								},
							].map((item) => (
								<div
									key={item.title}
									className="flex flex-col gap-2 rounded-lg border border-[var(--ms-border)] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4"
								>
									<div className="min-w-0">
										<span
											className={`inline-flex rounded px-2 py-0.5 text-[11px] font-medium ${item.badgeClass}`}
										>
											{item.badge}
										</span>
										<p className="mt-1.5 truncate text-sm font-medium text-[var(--ms-navy)]">
											{item.title}
										</p>
										<p className="text-xs text-[var(--ms-muted)]">
											{item.meta}
										</p>
									</div>
									<span className="hidden text-xs font-medium text-[var(--ms-navy)] sm:inline">
										Review →
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ProjectDashboardMock() {
	return (
		<div className="ms-mock">
			<div className="border-b border-[var(--ms-border)] px-4 py-4 sm:px-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<p className="text-xs font-medium uppercase tracking-wider text-[var(--ms-muted)]">
							Project
						</p>
						<h3 className="mt-1 text-lg font-semibold text-[var(--ms-navy)] sm:text-xl">
							Mobile App Development
						</h3>
					</div>
					<div className="flex items-center gap-3">
						<span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
							On Track
						</span>
						<span className="text-sm font-semibold text-[var(--ms-navy)]">
							72% Complete
						</span>
					</div>
				</div>

				<div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--ms-surface)]">
					<div className="h-full w-[72%] rounded-full bg-[var(--ms-navy)]" />
				</div>

				<div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
					{[
						{ label: "Budget", value: "₦4.2m" },
						{ label: "Contractors", value: "3" },
						{ label: "Deadline", value: "Oct 30" },
						{ label: "Health", value: "On Track" },
					].map((item) => (
						<div key={item.label}>
							<p className="text-xs text-[var(--ms-muted)]">{item.label}</p>
							<p className="mt-1 text-sm font-semibold text-[var(--ms-navy)]">
								{item.value}
							</p>
						</div>
					))}
				</div>
			</div>

			<div className="grid gap-0 lg:grid-cols-2">
				<div className="border-b border-[var(--ms-border)] p-4 sm:p-6 lg:border-b-0 lg:border-r">
					<p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ms-muted)]">
						Work activity
					</p>
					<div className="space-y-3">
						{[
							{ tool: "GitHub", detail: "14 commits" },
							{ tool: "Linear", detail: "6 issues completed" },
							{ tool: "Slack", detail: "32 relevant conversations" },
							{ tool: "Google Drive", detail: "Documentation updated" },
						].map((row) => (
							<div
								key={row.tool}
								className="flex items-center justify-between rounded-lg border border-[var(--ms-border)] px-3 py-3"
							>
								<div className="flex items-center gap-3">
									<span className="flex size-8 items-center justify-center rounded-md bg-[var(--ms-surface)] text-xs font-semibold text-[var(--ms-navy)]">
										{row.tool.slice(0, 2).toUpperCase()}
									</span>
									<span className="text-sm font-medium text-[var(--ms-navy)]">
										{row.tool}
									</span>
								</div>
								<span className="text-sm text-[var(--ms-muted)]">
									{row.detail}
								</span>
							</div>
						))}
					</div>
				</div>

				<div className="p-4 sm:p-6">
					<p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ms-muted)]">
						Current milestone
					</p>
					<div className="rounded-lg border border-[var(--ms-border)] p-4">
						<div className="flex items-start justify-between gap-3">
							<div>
								<p className="text-xs text-[var(--ms-muted)]">Milestone 3</p>
								<p className="mt-1 text-base font-semibold text-[var(--ms-navy)]">
									Backend API Integration
								</p>
							</div>
							<span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
								Awaiting approval
							</span>
						</div>
						<p className="mt-4 text-2xl font-semibold tracking-tight text-[var(--ms-navy)]">
							₦400,000
						</p>
						<p className="mt-1 text-sm text-[var(--ms-muted)]">
							Submitted by John Adeyemi · Sep 14
						</p>
						<button
							type="button"
							className="mt-5 inline-flex h-9 items-center rounded-md bg-[var(--ms-navy)] px-4 text-sm font-medium text-white"
						>
							Review milestone
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export function VerificationMock() {
	return (
		<div className="overflow-hidden rounded-xl border border-[var(--ms-border)] bg-white shadow-[0_12px_40px_rgb(20_24_31/0.06)]">
			<div className="grid lg:grid-cols-2">
				<div className="border-b border-[var(--ms-border)] p-5 sm:p-7 lg:border-b-0 lg:border-r">
					<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ms-muted)]">
						What was agreed
					</p>
					<h4 className="mt-3 text-lg font-semibold text-[var(--ms-navy)]">
						Backend API Integration
					</h4>
					<ul className="mt-5 space-y-2.5">
						{[
							"Authentication API",
							"User Profile API",
							"Payment API",
							"API Documentation",
							"Automated Tests",
						].map((item) => (
							<li
								key={item}
								className="flex items-center gap-2.5 text-sm text-[var(--ms-ink)]"
							>
								<span className="size-1.5 rounded-full bg-[var(--ms-navy)]" />
								{item}
							</li>
						))}
					</ul>
					<div className="mt-6 border-t border-[var(--ms-border)] pt-5">
						<p className="text-xs text-[var(--ms-muted)]">Milestone value</p>
						<p className="mt-1 text-2xl font-semibold text-[var(--ms-navy)]">
							₦400,000
						</p>
					</div>
				</div>

				<div className="bg-[var(--ms-surface-2)] p-5 sm:p-7">
					<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ms-muted)]">
						What was delivered
					</p>
					<div className="mt-5 space-y-3">
						{[
							{ tool: "GitHub", detail: "14 commits · 6 pull requests" },
							{ tool: "Linear", detail: "6 issues completed" },
							{ tool: "Google Drive", detail: "Documentation updated" },
							{ tool: "Slack", detail: "Relevant project activity" },
						].map((row) => (
							<div
								key={row.tool}
								className="rounded-lg border border-[var(--ms-border)] bg-white px-3 py-3"
							>
								<p className="text-sm font-medium text-[var(--ms-navy)]">
									{row.tool}
								</p>
								<p className="mt-0.5 text-sm text-[var(--ms-muted)]">
									{row.detail}
								</p>
							</div>
						))}
					</div>

					<div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--ms-border)] pt-5">
						<div className="flex gap-8">
							<div>
								<p className="text-3xl font-semibold tracking-tight text-[var(--ms-navy)]">
									82%
								</p>
								<p className="mt-1 text-xs text-[var(--ms-muted)]">
									Completion signal
								</p>
							</div>
							<div>
								<p className="text-3xl font-semibold tracking-tight text-[var(--ms-navy)]">
									3
								</p>
								<p className="mt-1 text-xs text-[var(--ms-muted)]">
									Outstanding issues
								</p>
							</div>
						</div>
						<button
							type="button"
							className="inline-flex h-10 items-center rounded-md bg-[var(--ms-navy)] px-4 text-sm font-medium text-white"
						>
							Review milestone
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export function PaymentReviewMock() {
	return (
		<div className="ms-mock max-w-lg">
			<div className="border-b border-[var(--ms-border)] px-5 py-4">
				<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ms-muted)]">
					Payment review
				</p>
			</div>
			<div className="p-5 sm:p-6">
				<div className="flex items-center gap-3">
					<div className="flex size-11 items-center justify-center rounded-full bg-[var(--ms-surface)] text-sm font-semibold text-[var(--ms-navy)]">
						JA
					</div>
					<div>
						<p className="font-semibold text-[var(--ms-navy)]">John Adeyemi</p>
						<p className="text-sm text-[var(--ms-muted)]">Contractor</p>
					</div>
				</div>

				<div className="mt-6 space-y-4">
					<div>
						<p className="text-xs text-[var(--ms-muted)]">Deliverable</p>
						<p className="mt-1 text-sm font-medium text-[var(--ms-navy)]">
							Backend API Integration
						</p>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-xs text-[var(--ms-muted)]">Milestone</p>
							<p className="mt-1 text-sm font-medium text-[var(--ms-navy)]">
								Milestone 3
							</p>
						</div>
						<div>
							<p className="text-xs text-[var(--ms-muted)]">Submitted</p>
							<p className="mt-1 text-sm font-medium text-[var(--ms-navy)]">
								September 14
							</p>
						</div>
					</div>
					<div>
						<p className="text-xs text-[var(--ms-muted)]">Amount</p>
						<p className="mt-1 text-3xl font-semibold tracking-tight text-[var(--ms-navy)]">
							₦400,000
						</p>
					</div>
					<div>
						<p className="text-xs text-[var(--ms-muted)]">Evidence</p>
						<p className="mt-1 text-sm text-[var(--ms-ink)]">
							14 commits · 6 PRs · 6 completed issues
						</p>
					</div>
					<div className="flex items-center justify-between rounded-lg border border-[var(--ms-border)] bg-[var(--ms-surface-2)] px-3 py-3">
						<span className="text-sm text-[var(--ms-muted)]">Status</span>
						<span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
							Ready for approval
						</span>
					</div>
				</div>

				<div className="mt-6 flex flex-col gap-2 sm:flex-row">
					<button
						type="button"
						className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-[var(--ms-navy)] px-4 text-sm font-medium text-white"
					>
						Approve & Pay
					</button>
					<button
						type="button"
						className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-[var(--ms-border)] bg-white px-4 text-sm font-medium text-[var(--ms-navy)]"
					>
						Request changes
					</button>
				</div>
				<p className="mt-4 text-xs leading-relaxed text-[var(--ms-muted)]">
					Payments are tracked and orchestrated through connected payment
					providers. Milestone does not hold customer funds.
				</p>
			</div>
		</div>
	);
}

export function InsightsMock() {
	return (
		<div className="ms-mock">
			<div className="grid gap-0 lg:grid-cols-3">
				<div className="border-b border-[var(--ms-border)] p-5 sm:p-6 lg:border-b-0 lg:border-r">
					<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ms-muted)]">
						Project health
					</p>
					<p className="mt-3 text-sm text-[var(--ms-ink)]">
						3 projects need attention.
					</p>
					<div className="mt-4 space-y-3">
						{[
							{ name: "Website Redesign", meta: "4 days behind" },
							{ name: "Mobile App", meta: "2 days behind" },
							{ name: "Marketing Campaign", meta: "1 day behind" },
						].map((p) => (
							<div
								key={p.name}
								className="rounded-lg border border-[var(--ms-border)] px-3 py-3"
							>
								<p className="text-sm font-medium text-[var(--ms-navy)]">
									{p.name}
								</p>
								<p className="mt-0.5 text-xs text-amber-700">{p.meta}</p>
							</div>
						))}
					</div>
				</div>

				<div className="border-b border-[var(--ms-border)] p-5 sm:p-6 lg:border-b-0 lg:border-r">
					<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ms-muted)]">
						Payments
					</p>
					<p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ms-navy)]">
						₦4.8m
					</p>
					<p className="mt-1 text-sm text-[var(--ms-muted)]">
						Expected this week
					</p>
					<div className="mt-5 space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-[var(--ms-muted)]">Milestones</span>
							<span className="font-medium text-[var(--ms-navy)]">7</span>
						</div>
						<div className="flex justify-between">
							<span className="text-[var(--ms-muted)]">Approved</span>
							<span className="font-medium text-[var(--ms-navy)]">5</span>
						</div>
						<div className="flex justify-between">
							<span className="text-[var(--ms-muted)]">Awaiting approval</span>
							<span className="font-medium text-[var(--ms-navy)]">2</span>
						</div>
					</div>
				</div>

				<div className="p-5 sm:p-6">
					<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ms-muted)]">
						Contracts
					</p>
					<p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ms-navy)]">
						3
					</p>
					<p className="mt-1 text-sm text-[var(--ms-muted)]">
						Contracts approaching renewal
					</p>
					<div className="mt-5 rounded-lg border border-[var(--ms-border)] bg-[var(--ms-surface-2)] px-3 py-3 text-sm text-[var(--ms-muted)]">
						Milestone uses automation and intelligence to surface delays,
						summarize activity and identify items that need attention.
					</div>
				</div>
			</div>
		</div>
	);
}
