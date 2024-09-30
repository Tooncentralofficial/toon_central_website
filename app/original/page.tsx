"use server";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import Originals from "./originals";

export default async function Page() {
  const queryClient = new QueryClient();
  const pagination = { page: 1, total: 1 };
  const filter="all"
  await queryClient.prefetchQuery({
    queryKey: ["all_originals", pagination.page,filter],
    queryFn: () =>
      getRequest(
        `/originals/pull/all?filter=all&page=${pagination.page}&limit=30`
      ),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <Originals />
      </main>
    </HydrationBoundary>
  );
}
