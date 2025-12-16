"use server";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import DiscoverClientPage from "./pageClient";


export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["discover_trending"],
    queryFn: () =>
      getRequest("/trending/new-and-trending?filter=all&page=1&limit=50"),
  });
  console.log("Prefetched all_genres data",  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <DiscoverClientPage />
      </main>
    </HydrationBoundary>
  );
}
