"use server";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import HomeCarousel from "./_page/homeCarousel";
import Originals from "./_page/originals";
import Popular from "./_page/popular";
import RecommendtnTabs from "./_page/recommendtnTabs";
import Trending from "./_page/trending";
import Footer from "./_shared/layout/footer";
import { getRequest } from "./utils/queries/requests";

export default async function Home() {
  const queryClient = new QueryClient();
  // const getCarousel = await getRequest("/home/top-carousel?page=1&limit=10");
  // console.log("getCafro", getCarousel?.data?.comics);

  await queryClient.prefetchQuery({
    queryKey: ["carousel"],
    queryFn: () => getRequest("/home/top-carousel?page=1&limit=10"),
  });
  // await queryClient.prefetchQuery({
  //   queryKey: ["popular_by_toon"],
  //   queryFn: () =>
  //     getRequest("/home/popular-by-toon-central?filter=all&page=1&limit=10"),
  // });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <HomeCarousel />
        <RecommendtnTabs />
        <Popular />
        <Trending />
        <Originals />
        <Footer />
      </main>
    </HydrationBoundary>
  );
}
