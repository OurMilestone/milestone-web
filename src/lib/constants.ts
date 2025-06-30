import type { UserRole } from "@/types/auth/auth-types";
import type {
	PaymentInfoCardData,
	PaymentTransaction,
	TransactionStatus,
	TransactionType,
} from "@/types/dashboard/payments-types";
import type {
	ProjectTaskListItem,
	TaskDetail,
	UserProfile,
} from "@/types/dashboard/task-details-types";
import type {
	ProjectTaskBoardData,
	TaskLabel,
	TaskPriority,
} from "@/types/dashboard/taskboard-types";
import {
	Briefcase,
	CheckCircle2,
	Clock4,
	DollarSign,
	type LucideIcon,
} from "lucide-react";

export interface TeamMember {
	initials: string;
	color: string;
	name?: string;
	isOwner?: boolean;
	role?: string;
}

export interface Project {
	id: string;
	title: string;
	company: string;
	status: "pending" | "in_progress" | "completed" | "cancelled";
	budget: number;
	duration: string;
	image?: string;
	teamMembers: TeamMember[];
	comments: number;
}

export interface StatCardData {
	title: string;
	value: string;
	change?: string;
	changeText: string;
	icon: LucideIcon;
	iconBg: string;
	iconColor: string;
}

interface RoleStats {
	totalEarnings?: number;
	totalSpent?: number;
	activeProjects: number;
	pendingEarnings?: number;
	pendingPayments?: number;
	completedProjects: number;
	earningsChange?: string;
	spentChange?: string;
	projectsChange: string;
	pendingChange?: string;
	completedChange: string;
}

export type DashboardStatsType = {
	[key in UserRole]: RoleStats;
};

export const DASHBOARD_STATS: DashboardStatsType = {
	Freelancer: {
		totalEarnings: 45231,
		activeProjects: 2,
		pendingEarnings: 45231,
		completedProjects: 4,
		earningsChange: "+2.5%",
		projectsChange: "vs last month",
		pendingChange: "+2.5%",
		completedChange: "vs last month",
	},
	Contractor: {
		totalSpent: 125000,
		activeProjects: 8,
		pendingPayments: 25000,
		completedProjects: 12,
		spentChange: "+5.2%",
		projectsChange: "+3 vs last month",
		pendingChange: "-1.2%",
		completedChange: "+2 vs last month",
	},
};

export function getStatCardsConfig(
	role: UserRole,
	stats: RoleStats,
): StatCardData[] {
	if (role === "Freelancer") {
		return [
			{
				title: "Total Earnings",
				value: `$${(stats.totalEarnings ?? 0).toLocaleString()}`,
				change: stats.earningsChange,
				changeText: "vs last month",
				icon: DollarSign,
				iconBg: "bg-green-100 dark:bg-green-900/30",
				iconColor: "text-green-600 dark:text-green-400",
			},
			{
				title: "Active Projects",
				value: (stats.activeProjects ?? 0).toString(),
				changeText: stats.projectsChange,
				icon: Briefcase,
				iconBg: "bg-purple-100 dark:bg-purple-900/30",
				iconColor: "text-purple-600 dark:text-purple-400",
			},
			{
				title: "Pending Earnings",
				value: `$${(stats.pendingEarnings ?? 0).toLocaleString()}`,
				change: stats.pendingChange,
				changeText: "vs last month",
				icon: DollarSign,
				iconBg: "bg-green-100 dark:bg-green-900/30",
				iconColor: "text-green-600 dark:text-green-400",
			},
			{
				title: "Completed Projects",
				value: (stats.completedProjects ?? 0).toString(),
				changeText: stats.completedChange,
				icon: Briefcase,
				iconBg: "bg-purple-100 dark:bg-purple-900/30",
				iconColor: "text-purple-600 dark:text-purple-400",
			},
		];
	}
	// Contractor
	return [
		{
			title: "Total Spent",
			value: `$${(stats.totalSpent ?? 0).toLocaleString()}`,
			change: stats.spentChange,
			changeText: "vs last month",
			icon: DollarSign,
			iconBg: "bg-red-100 dark:bg-red-900/30",
			iconColor: "text-red-600 dark:text-red-400",
		},
		{
			title: "Active Projects",
			value: (stats.activeProjects ?? 0).toString(),
			changeText: stats.projectsChange,
			icon: Briefcase,
			iconBg: "bg-purple-100 dark:bg-purple-900/30",
			iconColor: "text-purple-600 dark:text-purple-400",
		},
		{
			title: "Pending Payments",
			value: `$${(stats.pendingPayments ?? 0).toLocaleString()}`,
			change: stats.pendingChange,
			changeText: "vs last month",
			icon: DollarSign,
			iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
			iconColor: "text-yellow-600 dark:text-yellow-400",
		},
		{
			title: "Completed Projects",
			value: (stats.completedProjects ?? 0).toString(),
			changeText: stats.completedChange,
			icon: Briefcase,
			iconBg: "bg-blue-100 dark:bg-blue-900/30",
			iconColor: "text-blue-600 dark:text-blue-400",
		},
	];
}

export const SIDEBAR_NAVIGATION = {
	Freelancer: [
		{
			title: "Dashboard",
			icon: "LayoutDashboard",
			href: "/freelancer/dashboard/overview",
			badge: "10",
		},
		{
			title: "Projects",
			icon: "Briefcase",
			href: "/freelancer/dashboard/projects",
			badge: "10",
		},
		// {
		// 	title: "Messages",
		// 	icon: "MessageSquare",
		// 	href: "/freelancer/dashboard/messages",
		// 	badge: "10",
		// },
		// {
		// 	title: "Profile",
		// 	icon: "User",
		// 	href: "/freelancer/dashboard/profile",
		// },
		// {
		// 	title: "Reviews",
		// 	icon: "Star",
		// 	href: "/freelancer/dashboard/reviews",
		// 	badge: "10",
		// },
		{
			title: "Payments",
			icon: "DollarSign",
			href: "/freelancer/dashboard/payments",
			badge: "10",
		},
	],
	Contractor: [
		{
			title: "Dashboard",
			icon: "LayoutDashboard",
			href: "/contractor/dashboard/overview",
			badge: "5",
		},
		{
			title: "Projects",
			icon: "Briefcase",
			href: "/contractor/dashboard/projects",
			badge: "8",
		},
		// {
		// 	title: "Workers",
		// 	icon: "Users",
		// 	href: "/contractor/dashboard/workers",
		// 	badge: "12",
		// },
		// {
		// 	title: "Messages",
		// 	icon: "MessageSquare",
		// 	href: "/contractor/dashboard/messages",
		// 	badge: "15",
		// },
		// {
		// 	title: "Profile",
		// 	icon: "User",
		// 	href: "/contractor/dashboard/profile",
		// },
		{
			title: "Payments",
			icon: "DollarSign",
			href: "/contractor/dashboard/payments",
			badge: "3",
		},
	],
};

export const USER_PROFILE = {
	name: "Mofi Osakuni",
	email: "mofis@gmail.com",
	avatar: "/placeholder.svg?height=40&width=40",
	isOnline: true,
};

/**---------------------TaskBoard----------------------- */
export const DEFAULT_ASSIGNEE_AVATAR = "/assets/svgs/default-avatar.svg";

export const staticTaskBoardData: ProjectTaskBoardData = {
	projectId: 1,
	projectName: "Mobile App Redesign",
	columns: [
		{ id: "backlog", title: "Backlog" },
		// { id: "selected_for_development", title: "Selected for Development" }, // <-- Remove this column
		{ id: "in_progress", title: "In Progress" },
		{ id: "in_review", title: "In Review" },
		{ id: "done", title: "Done" },
	],
	tasks: [
		// Backlog Tasks
		{
			id: "task-1",
			columnId: "backlog",
			order: 1,
			title: "Return roles in the system with the Config endpoint",
			code: "EB-2",
			labels: [
				{
					id: "l1",
					name: "Tech Debt",
					colorClasses:
						"bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300",
				},
			],
			priority: "medium",
			assignees: [
				{
					id: "u1",
					name: "User One",
					initials: "UO",
					avatarUrl: "https://i.pravatar.cc/40?u=user1",
				},
			],
		},
		{
			id: "task-2",
			columnId: "backlog",
			order: 2,
			title: "Implement user authentication flow",
			code: "AUTH-1",
			labels: [
				{
					id: "l2",
					name: "Feature",
					colorClasses:
						"bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300",
				},
			],
			priority: "high",
			assignees: [
				{
					id: "u2",
					name: "User Two",
					initials: "UT",
					avatarUrl: "https://i.pravatar.cc/40?u=user2",
				},
			],
		},
		// Previously "Selected for Development" task, now moved to "Backlog" or "In Progress"
		// Example: Moving task-3 to "Backlog"
		{
			id: "task-3",
			columnId: "backlog",
			order: 3,
			title: "Design new dashboard components", // Was selected_for_development
			code: "UI-5",
			labels: [
				{
					id: "l3",
					name: "Design",
					colorClasses:
						"bg-pink-100 text-pink-700 dark:bg-pink-700/30 dark:text-pink-300",
				},
			],
			priority: "high",
			assignees: [
				{
					id: "u3",
					name: "User Three",
					initials: "UH",
					avatarUrl: "https://i.pravatar.cc/40?u=user3",
				},
			],
		},
		// In Progress Tasks
		{
			id: "task-4",
			columnId: "in_progress",
			order: 1,
			title: "Develop API for project management",
			code: "API-12",
			labels: [
				{
					id: "l2",
					name: "Feature",
					colorClasses:
						"bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300",
				},
			],
			priority: "urgent",
			assignees: [
				{
					id: "u1",
					name: "User One",
					initials: "UO",
					avatarUrl: "https://i.pravatar.cc/40?u=user1",
				},
			],
		},
		// In Review Tasks
		{
			id: "task-5",
			columnId: "in_review",
			order: 1,
			title: "Test payment gateway integration",
			code: "QA-7",
			labels: [
				{
					id: "l4",
					name: "Testing",
					colorClasses:
						"bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300",
				},
			],
			priority: "high",
			assignees: [
				{
					id: "u4",
					name: "User Four",
					initials: "UF",
					avatarUrl: "https://i.pravatar.cc/40?u=user4",
				},
			],
		},
		{
			id: "task-6",
			columnId: "in_review",
			order: 2,
			title: "Return roles in the system with the Config endpoint (Review)", // Clarified title for uniqueness
			code: "EB-2R", // Made code unique for this example if it's a different instance
			labels: [
				{
					id: "l1",
					name: "Tech Debt",
					colorClasses:
						"bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300",
				},
			],
			priority: "medium",
			assignees: [
				{
					id: "u2",
					name: "User Two",
					initials: "UT",
					avatarUrl: "https://i.pravatar.cc/40?u=user2",
				},
			],
		},
		// Done Tasks
		{
			id: "task-7",
			columnId: "done",
			order: 1,
			title: "Setup project repository and CI/CD",
			code: "DEV-1",
			labels: [
				{
					id: "l5",
					name: "DevOps",
					colorClasses:
						"bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300",
				},
			],
			priority: "low",
			assignees: [
				{
					id: "u3",
					name: "User Three",
					initials: "UH",
					avatarUrl: "https://i.pravatar.cc/40?u=user3",
				},
			],
		},
	],
};

/**---------------------TaskPage----------------------- */

export const staticTaskDetailData: Record<string, TaskDetail> = {
	"task-1": {
		id: "task-1",
		title: "Return roles in the system with the Config endpoint",
		project: {
			id: "mobile-app-redesign",
			name: "Mobile App Redesign",
			slug: "mobile-app-redesign",
		},
		columnId: "backlog",
		code: "EB-2",
		description:
			"<p>This task involves updating the <strong>configuration endpoint</strong> to include user roles. This is crucial for the frontend to adapt its UI based on the logged-in user's permissions.</p><ul><li>List item 1</li><li>List item 2</li></ul><p><code>GET /api/config</code> should return roles.</p>",
		labels: [
			{
				id: "l1",
				name: "Tech Debt",
				colorClasses:
					"bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300",
			},
			{
				id: "l-api",
				name: "API",
				colorClasses:
					"bg-sky-100 text-sky-700 dark:bg-sky-700/30 dark:text-sky-300",
			},
		],
		priority: "medium",
		assignees: [
			{
				id: "u1",
				name: "User One",
				initials: "UO",
				avatarUrl: "https://i.pravatar.cc/40?u=user1",
			},
		],
		reporter: {
			id: "u2",
			name: "John Obi",
			initials: "JO",
			avatarUrl: "https://i.pravatar.cc/40?u=user2",
		},
		subtasks: [
			{
				id: "sub-1",
				title: "Define role structure in API response",
				code: "EB-2.1",
				isCompleted: true,
				columnId: "done",
				priority: "medium",
				assignee: {
					id: "u1",
					name: "User One",
					initials: "UO",
					avatarUrl: "https://i.pravatar.cc/40?u=user1",
				},
			},
			{
				id: "sub-2",
				title: "Implement backend logic for roles",
				code: "EB-2.2",
				isCompleted: false,
				columnId: "in_progress",
				priority: "high",
				assignee: {
					id: "u2",
					name: "User One",
					initials: "UO",
					avatarUrl: "https://i.pravatar.cc/40?u=user1",
				},
			},
			{
				id: "sub-3",
				title: "Rename 'User' data 'Userprofile'",
				code: "EB-2.3",
				isCompleted: true,
				columnId: "backlog",
				priority: "low",
				assignee: {
					id: "u2",
					name: "John Obi",
					initials: "JO",
					avatarUrl: "https://i.pravatar.cc/40?u=user2",
				},
			},
		],
		updateInterval: "Every 2 Days",
		client: { id: "client-1", name: "John Obi" },
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	"task-2": {
		id: "task-4",
		title: "Develop API for project management",
		project: {
			id: "mobile-app-redesign",
			name: "Mobile App Redesign",
			slug: "mobile-app-redesign",
		},
		columnId: "in_progress",
		code: "API-12",
		description: "<p>Initial API development for core project features.</p>",
		labels: [
			{
				id: "l2",
				name: "Feature",
				colorClasses:
					"bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300",
			},
		],
		priority: "urgent",
		assignees: [
			{
				id: "u1",
				name: "User One",
				initials: "UO",
				avatarUrl: "https://i.pravatar.cc/40?u=user1",
			},
		],
		reporter: {
			id: "u3",
			name: "User Three",
			initials: "UH",
			avatarUrl: "https://i.pravatar.cc/40?u=user3",
		},
		subtasks: [
			{
				id: "sub-1",
				title: "Define role structure in API response",
				code: "EB-2.1",
				isCompleted: true,
				columnId: "done",
				priority: "medium",
				assignee: {
					id: "u1",
					name: "User One",
					initials: "UO",
					avatarUrl: "https://i.pravatar.cc/40?u=user1",
				},
			},
			{
				id: "sub-2",
				title: "Implement backend logic for roles",
				code: "EB-2.2",
				isCompleted: false,
				columnId: "in_progress",
				priority: "high",
				assignee: {
					id: "u2",
					name: "User One",
					initials: "UO",
					avatarUrl: "https://i.pravatar.cc/40?u=user1",
				},
			},
			{
				id: "sub-3",
				title: "Rename 'User' data 'Userprofile'",
				code: "EB-2.3",
				isCompleted: true,
				columnId: "backlog",
				priority: "low",
				assignee: {
					id: "u2",
					name: "John Obi",
					initials: "JO",
					avatarUrl: "https://i.pravatar.cc/40?u=user2",
				},
			},
		],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	"task-3": {
		id: "task-4",
		title: "Develop API for project management",
		project: {
			id: "mobile-app-redesign",
			name: "Mobile App Redesign",
			slug: "mobile-app-redesign",
		},
		columnId: "in_progress",
		code: "API-12",
		description: "<p>Initial API development for core project features.</p>",
		labels: [
			{
				id: "l2",
				name: "Feature",
				colorClasses:
					"bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300",
			},
		],
		priority: "urgent",
		assignees: [
			{
				id: "u1",
				name: "User One",
				initials: "UO",
				avatarUrl: "https://i.pravatar.cc/40?u=user1",
			},
		],
		reporter: {
			id: "u3",
			name: "User Three",
			initials: "UH",
			avatarUrl: "https://i.pravatar.cc/40?u=user3",
		},
		subtasks: [
			{
				id: "sub-1",
				title: "Define role structure in API response",
				code: "EB-2.1",
				isCompleted: true,
				columnId: "done",
				priority: "medium",
				assignee: {
					id: "u1",
					name: "User One",
					initials: "UO",
					avatarUrl: "https://i.pravatar.cc/40?u=user1",
				},
			},
			{
				id: "sub-2",
				title: "Implement backend logic for roles",
				code: "EB-2.2",
				isCompleted: false,
				columnId: "in_progress",
				priority: "high",
				assignee: {
					id: "u2",
					name: "User One",
					initials: "UO",
					avatarUrl: "https://i.pravatar.cc/40?u=user1",
				},
			},
			{
				id: "sub-3",
				title: "Rename 'User' data 'Userprofile'",
				code: "EB-2.3",
				isCompleted: true,
				columnId: "backlog",
				priority: "low",
				assignee: {
					id: "u2",
					name: "John Obi",
					initials: "JO",
					avatarUrl: "https://i.pravatar.cc/40?u=user2",
				},
			},
		],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
};

export const staticProjectTaskList: ProjectTaskListItem[] =
	staticTaskBoardData.tasks.map((task) => ({
		id: task.id,
		title: task.title,
		code: task.code,
		priority: "low",
		assignee: task.assignees?.[0]
			? {
					initials: task.assignees[0].initials,
					avatarUrl: task.assignees[0].avatarUrl,
				}
			: undefined,
		columnId: task.columnId,
	}));

export const assignableUsers: UserProfile[] = [
	{
		id: "u1",
		name: "User One",
		initials: "UO",
		avatarUrl: "https://i.pravatar.cc/40?u=user1",
	},
	{
		id: "u2",
		name: "John Obi",
		initials: "JO",
		avatarUrl: "https://i.pravatar.cc/40?u=user2",
	},
	{
		id: "u3",
		name: "User Three",
		initials: "UH",
		avatarUrl: "https://i.pravatar.cc/40?u=user3",
	},
	{
		id: "u4",
		name: "User Four",
		initials: "UF",
		avatarUrl: "https://i.pravatar.cc/40?u=user4",
	},
];

export const availableLabels: TaskLabel[] = [
	{
		id: "l1",
		name: "Tech Debt",
		colorClasses:
			"bg-purple-100 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300",
	},
	{
		id: "l2",
		name: "Feature",
		colorClasses:
			"bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300",
	},
	{
		id: "l3",
		name: "Design",
		colorClasses:
			"bg-pink-100 text-pink-700 dark:bg-pink-700/30 dark:text-pink-300",
	},
	{
		id: "l-api",
		name: "API",
		colorClasses:
			"bg-sky-100 text-sky-700 dark:bg-sky-700/30 dark:text-sky-300",
	},
	{
		id: "l-server",
		name: "Server",
		colorClasses:
			"bg-emerald-100 text-emerald-700 dark:bg-emerald-700/30 dark:text-emerald-300",
	},
];

export const priorities: {
	value: TaskPriority;
	label: string;
	icon?: React.ElementType;
}[] = [
	{ value: "low", label: "Low" },
	{ value: "medium", label: "Medium" },
	{ value: "high", label: "High" },
	{ value: "urgent", label: "Urgent" },
];

export const updateIntervals = [
	"Every 2 Days",
	"Every 4 Days",
	"Every 1 week",
	"Every 2 week",
	"Every 1 month",
	"None",
];

/**---------------------Payments Page----------------------- */

export const freelancerPaymentInfoCards: PaymentInfoCardData[] = [
	{
		id: "wallet-balance",
		title: "Wallet Balance",
		amount: 33000,
		icon: DollarSign,
		iconBgColor: "bg-green-100 dark:bg-green-900/30",
		iconColor: "text-green-600 dark:text-green-400",
		percentageChange: 12,
		changePeriod: "from last month",
	},
	{
		id: "next-payout",
		title: "Next Payout",
		amount: 2530.5,
		icon: CheckCircle2,
		iconBgColor: "bg-blue-100 dark:bg-blue-900/30",
		iconColor: "text-blue-600 dark:text-blue-400",
		footerText: "3 payments this month",
	},
];

export const contractorPaymentInfoCards: PaymentInfoCardData[] = [
	{
		id: "available-funds",
		title: "Available Funds",
		amount: 50000,
		icon: DollarSign,
		iconBgColor: "bg-green-100 dark:bg-green-900/30",
		iconColor: "text-green-600 dark:text-green-400",
		percentageChange: 5,
		changePeriod: "from last week",
	},
	{
		id: "pending-payments",
		title: "Pending Payments",
		amount: 7500,
		icon: Clock4,
		iconBgColor: "bg-yellow-100 dark:bg-yellow-900/30",
		iconColor: "text-yellow-600 dark:text-yellow-400",
		footerText: "5 upcoming payments",
	},
];

const generateRandomDate = (start: Date, end: Date): string => {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime()),
	).toISOString();
};

export const transactionTypes: TransactionType[] = [
	"Deposit",
	"Withdrawal",
	"Milestone Release",
	"Refund",
];
export const transactionStatuses: TransactionStatus[] = [
	"Successful",
	"Pending",
	"Failed",
	"Cancelled",
];

export const staticPaymentHistory: PaymentTransaction[] = Array.from(
	{ length: 100 },
	(_, i) => {
		const type =
			transactionTypes[Math.floor(Math.random() * transactionTypes.length)];

		const amount = Math.floor(Math.random() * 5000) + 100;

		if (type === "Withdrawal" || type === "Refund") {
			// amount = amount;
		}
		return {
			id: `txn-${i + 1}`,
			date: generateRandomDate(new Date(2023, 10, 1), new Date(2025, 5, 30)),
			transactionType: type,
			description: `${type} for Project ${String.fromCharCode(65 + (i % 5))}`,
			amount: amount,
			currency: "USD",
			status:
				transactionStatuses[
					Math.floor(Math.random() * transactionStatuses.length)
				],
		};
	},
).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const CURRENCIES = ["USD", "EUR", "GBP", "NGN"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const WITHDRAWAL_DESTINATIONS = [
	{ id: "gtb-001", name: "GTB Account (...0123)", type: "Bank" },
	{ id: "zenith-002", name: "Zenith Account (...4567)", type: "Bank" },
	{ id: "usdt-addr-1", name: "USDT Wallet (TRC20)", type: "Crypto" },
] as const;
export type WithdrawalDestination = (typeof WITHDRAWAL_DESTINATIONS)[number];

export interface SavedCard {
	id: string;
	cardType: string;
	last4Digits: string;
	expiryDate: string;
	isDefault?: boolean;
	cardName?: string;
}
