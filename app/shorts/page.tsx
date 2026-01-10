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
      const res = await getRequest(`home/shorts-carousel?page=1&limit=10`);

      return {
        shorts: res?.data?.shorts || [],
        nextPage: res?.data?.nextPage || null,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage?.nextPage,
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
