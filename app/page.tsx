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
import MainfooterWithDelay from "./_shared/layout/footermain";
import PopularByToons from "./_page/popularbytoons";
import HorizontalScroll from "./_page/test";
import CardTitleInMobile from "./_shared/cards/cardTitleinMobile";
import TodaysPicks from "./_page/todaysPicks";
import TodaysPicksMobile from "./_page/todaysPicksMobile";

export default async function Home() {
  const queryClient = new QueryClient();
  

  await queryClient.prefetchQuery({
    queryKey: ["carousel"],
    queryFn: () => getRequest("/home/top-carousel?page=1&limit=10"),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <HomeCarousel />
        <RecommendtnTabs />
        <Popular />
        <Trending />
        {/* <TodaysPicks /> */}
        <TodaysPicksMobile />
        <PopularByToons />
        <HorizontalScroll />
        <Originals />
        <Footer />
        <MainfooterWithDelay />
      </main>
    </HydrationBoundary>
  );
}
