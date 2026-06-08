import { QueryClient } from '@tanstack/react-query';

/** Shared React Query client. Tuned for a mock backend — short staleness so
 *  screens feel live, no aggressive refetch-on-focus on mobile. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
