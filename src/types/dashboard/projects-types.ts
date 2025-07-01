export type ProjectStatus =
	| "pending"
	| "in_progress"
	| "completed"
	| "cancelled";

export interface TeamMember {
	initials: string;
	color: string;
	name?: string;
	isOwner?: boolean;
	role?: string;
}

export interface UiProject {
	id: string;
	title: string;
	description: string;
	company: string;
	status: ProjectStatus;
	budget: number;
	duration: string;
	durationValue: number;
	durationUnit: string;
	image?: string;
	teamMembers: TeamMember[];
	comments: number;
	totalMembers?: number;
}
