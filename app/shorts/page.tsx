"use server";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ShortsClient from "./shortsClient";
import { getRequest } from "../utils/queries/requests";

export default async function ShortsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["shorts"],
    queryFn: async () => {
      try {
        const res = await getRequest(`home/shorts-carousel?page=1&limit=10`);

        // Ensure consistent return structure matching client-side query
        return {
          shorts: Array.isArray(res?.data?.shorts) ? res.data.shorts : [],
          nextPage: res?.data?.nextPage ?? null,
        };
      } catch (error) {
        // Return empty structure on error to prevent crashes
        console.error("Error prefetching shorts:", error);
        return {
          shorts: [],
          nextPage: null,
        };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      // Guard against undefined/null lastPage - match client-side structure
      if (!lastPage) return undefined;
      return lastPage.nextPage ?? undefined;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main
        className="overflow-hidden h-[100vh] w-full p-0 m-0 relative"
        style={{
          minHeight: "100vh",
        }}
      >
        <ShortsClient />
      </main>
    </HydrationBoundary>
  );
}
