import type { UserRole } from "@/types/auth/auth-types";
import { Briefcase, DollarSign, type LucideIcon } from "lucide-react";

export interface TeamMember {
	initials: string;
	color: string;
	// name?: string;
	// avatarUrl?: string;
}

export interface Project {
	id: string;
	title: string;
	company: string;
	status: "On Track" | "At Risk" | "Off Track" | "Completed" | "Pending";
	budget: number;
	duration: string;
	image?: string;
	teamMembers: TeamMember[];
	comments: number;
	// You might add more fields like:
	// description?: string;
	// startDate?: string | Date;
	// endDate?: string | Date;
	// progress?: number; // 0-100
	// lastUpdated?: string;
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

export const PROJECTS_DATA: Project[] = [
	{
		id: "1",
		title: "Website Design",
		company: "Acme Inc",
		status: "On Track",
		budget: 45000,
		duration: "2 Months",
		image: "/assets/images/dashboard-project-image.png",

		teamMembers: [
			{ initials: "OI", color: "bg-pink-200" },
			{ initials: "W", color: "bg-green-200" },
			{ initials: "CI", color: "bg-blue-200" },
			{ initials: "SD", color: "bg-yellow-200" },
		],
		comments: 3,
	},
	{
		id: "2",
		title: "Website Design",
		company: "Acme Inc",
		status: "On Track",
		budget: 45000,
		duration: "2 Months",
		teamMembers: [
			{ initials: "OI", color: "bg-pink-200" },
			{ initials: "W", color: "bg-green-200" },
			{ initials: "CI", color: "bg-blue-200" },
			{ initials: "SD", color: "bg-yellow-200" },
		],
		comments: 3,
	},
	{
		id: "3",
		title: "Website Design",
		company: "Acme Inc",
		status: "On Track",
		budget: 45000,
		duration: "2 Months",
		image: "/assets/images/dashboard-project-image.png",
		teamMembers: [
			{ initials: "OI", color: "bg-pink-200" },
			{ initials: "W", color: "bg-green-200" },
			{ initials: "CI", color: "bg-blue-200" },
			{ initials: "SD", color: "bg-yellow-200" },
		],
		comments: 3,
	},
	{
		id: "4",
		title: "Website Design",
		company: "Acme Inc",
		status: "On Track",
		budget: 45000,
		duration: "2 Months",
		teamMembers: [
			{ initials: "OI", color: "bg-pink-200" },
			{ initials: "W", color: "bg-green-200" },
			{ initials: "CI", color: "bg-blue-200" },
			{ initials: "SD", color: "bg-yellow-200" },
		],
		comments: 3,
	},
	{
		id: "5",
		title: "Website Design",
		company: "Acme Inc",
		status: "On Track",
		budget: 45000,
		duration: "2 Months",
		image: "/assets/images/dashboard-project-image.png",
		teamMembers: [
			{ initials: "OI", color: "bg-pink-200" },
			{ initials: "W", color: "bg-green-200" },
			{ initials: "CI", color: "bg-blue-200" },
			{ initials: "SD", color: "bg-yellow-200" },
		],
		comments: 3,
	},
	{
		id: "6",
		title: "Website Design",
		company: "Acme Inc",
		status: "On Track",
		budget: 45000,
		duration: "2 Months",
		teamMembers: [
			{ initials: "OI", color: "bg-pink-200" },
			{ initials: "W", color: "bg-green-200" },
			{ initials: "CI", color: "bg-blue-200" },
			{ initials: "SD", color: "bg-yellow-200" },
		],
		comments: 3,
	},
];

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
		{
			title: "Messages",
			icon: "MessageSquare",
			href: "/freelancer/dashboard/messages",
			badge: "10",
		},
		{
			title: "Profile",
			icon: "User",
			href: "/freelancer/dashboard/profile",
		},
		{
			title: "Reviews",
			icon: "Star",
			href: "/freelancer/dashboard/reviews",
			badge: "10",
		},
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
		{
			title: "Workers",
			icon: "Users",
			href: "/contractor/dashboard/workers",
			badge: "12",
		},
		{
			title: "Messages",
			icon: "MessageSquare",
			href: "/contractor/dashboard/messages",
			badge: "15",
		},
		{
			title: "Profile",
			icon: "User",
			href: "/contractor/dashboard/profile",
		},
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
