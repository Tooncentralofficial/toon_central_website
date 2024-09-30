"use server";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Library from "./library";

export default async function Page() {
  const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ["all_genres"],
  //   queryFn: () => getRequest("/genres/pull/list"),
  // });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <Library />
      </main>
    </HydrationBoundary>
  );
}
