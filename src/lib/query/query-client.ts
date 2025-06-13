import {
	QueryClient,
	defaultShouldDehydrateQuery,
	isServer,
} from "@tanstack/react-query";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000,
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				retry: (failureCount, error: any) => {
					if (error?.status === 401 || error?.status === 403) {
						return false;
					}

					if (error?.isCorsError) {
						return failureCount < 1;
					}

					return failureCount < 3;
				},
				// refetchOnWindowFocus: false,
				refetchOnReconnect: "always",
				retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			},
			dehydrate: {
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) ||
					query.state.status === "pending",
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
	if (isServer) {
		return makeQueryClient();
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}
