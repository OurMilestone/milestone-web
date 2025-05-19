import type { Tab } from "@/types";
import { BriefcaseBusiness, UsersRound } from "lucide-react";

export const tabs: Tab[] = [
	{
		id: 1,
		name: "Freelancer/Employee",
		role: "freelancer",
		description:
			"Showcase your skills, find exciting projects, and grow your independent career.",
		icon: UsersRound,
	},
	{
		id: 2,
		name: "Contractors",
		role: "contractor",
		description: "Track your projects, teams and make payments efficiently.",
		icon: BriefcaseBusiness,
	},
];
