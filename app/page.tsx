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
import FloatingButton from "./_page/floatingButton";
import { DEFAULT_OG_URL } from "./layout";
import { Metadata } from "next";

const images = [
  {
    url: DEFAULT_OG_URL,
    width: 1200,
    height: 630,
    alt: "Toon Central Comic Hub",
  },
  {
    url: DEFAULT_OG_URL,
    width: 800,
    height: 420,
    alt: "Toon Central Comic Hub",
  },
  {
    url: DEFAULT_OG_URL,
    width: 600,
    height: 315,
    alt: "Toon Central Comic Hub",
  },
];
//TODO: add satochi font
export const metadata: Metadata = {
  title: "Toon Central - Giving Africa a voice",
  description:
    "Discover Toon Central, the pioneering comic platform showcasing the black narrative with vibrant artistry and storytelling. Join a world where Marafiki (creators) bring stories ( Mafiki ) to life, combining African culture with innovative visuals, and connect with a community passionate about Afrocentric comics and animations. Dive into Toon Central today!",
  openGraph: {
    title: "Toon Central - Giving Africa a voice",
    description:
      "Discover Toon Central, the pioneering comic platform showcasing the black narrative with vibrant artistry and storytelling. Join a world where Marafiki (creators) bring stories ( Mafiki ) to life, combining African culture with innovative visuals, and connect with a community passionate about Afrocentric comics and animations. Dive into Toon Central today!",
    url: "https://tooncentralhub.com/",
    type: "website",
    images: images,
  },

  twitter: {
    card: "summary_large_image",
    site: "@tooncentralhub",
    title: "Toon Central - Giving Africa a voice",
    description:
      "Discover Toon Central, the pioneering comic platform showcasing the black narrative with vibrant artistry and storytelling. Join a world where Marafiki (creators) bring stories ( Mafiki ) to life, combining African culture with innovative visuals, and connect with a community passionate about Afrocentric comics and animations. Dive into Toon Central today!",
    images: images,
  },
};

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
        <FloatingButton />
      </main>
    </HydrationBoundary>
  );
}
