import type { LucideIcon } from "lucide-react";
import type { ApiResponse, UserRole } from "./auth/auth-types";

export interface Tab {
	id: number;
	name: string;
	role: UserRole;
	description: string;
	icon: LucideIcon;
}

export type PartialRequired<T, K extends keyof T> = Required<Pick<T, K>> &
	Omit<T, K>;

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type ActionResult<T> = {
	success: boolean;
	data: T | null;
	status: number;
	message: string;
};
export interface AxiosApiResponse<T> {
	data: ApiResponse<T>;
	status: number;
	statusText: string;
}

export interface ApiError {
	message: string;
	status?: number;
	data: ApiResponse<null>;
}
