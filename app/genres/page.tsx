"use server";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import Genres from "./genres";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["all_genres"],
    queryFn: () => getRequest("/selectables/genres"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <Genres />
      </main>
    </HydrationBoundary>
  );
}
