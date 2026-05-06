"use client";
import React, { useMemo } from 'react'
import MainfooterWithDelay from '../_shared/layout/footermain'
import Footer from '../_shared/layout/footer'
import FloatingButton from './floatingButton'
import HomeCarousel from './homeCarousel'
import RecommendtnTabs from './recommendtnTabs'
import HomeShorts from './shortsHome'
import Popular from './popular'
import Trending from './trending'
import TodaysPicksMobile from './todaysPicksMobile'
import PopularByToons from './popularbytoons'
import HorizontalScroll from './test'
import Originals from './originals'
import TodaysPicks from './todaysPicks'
import { getRequest } from '../utils/queries/requests';
import { useQuery } from '@tanstack/react-query';
export default function HomeContentWrapper() {
    const { data , isLoading} = useQuery({
        queryKey: ["home"],
        queryFn: () => getRequest("/home"),
    })
   console.log("@@homeData",data);
    const carouselData = useMemo(
      () => data?.data?.carousel || [],
      [data?.data?.carousel]
    );
    const popularData = useMemo(
      () => data?.data?.popular_by_toon_central || [],
      [data?.data?.popular_by_toon_central]
    );
    const trendingData = useMemo(
      () => data?.data?.trending || [],
      [data?.data?.trending]
    );

    const PopularByToonData = useMemo(
      () => data?.data?.popular_by_toon_central || [],
      [data?.data?.popular_by_toon_central]
    );

    const originalsData = useMemo(
      () => data?.data?.originals || [],
      [data?.data?.originals]
    );

  return (
    <div><HomeCarousel carouselData={carouselData}
    />
    <RecommendtnTabs />
    <HomeShorts />
    <Popular popularData={popularData} />
    <Trending trendingData={trendingData} isLoading={isLoading} />
    {/* <TodaysPicks /> */}
    <TodaysPicksMobile />
    <PopularByToons  popularData={PopularByToonData} />
    <HomeShorts offset={5} />
    <HorizontalScroll />
    <Originals originalsData ={originalsData} isLoading = {isLoading}  />
    <Footer />
    <MainfooterWithDelay />
    <FloatingButton />  </div>
  )
}