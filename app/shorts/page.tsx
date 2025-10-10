"use server";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ShortsClient from "./shortsClient"

export default async function ShortsPage() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <ShortsClient />
      </main>
    </HydrationBoundary>
  );
}
