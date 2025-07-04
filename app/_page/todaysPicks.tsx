"use client";
import React, { useEffect, useState } from "react";
import CardTitleInMobile from "../_shared/cards/cardTitleinMobile";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";

const TodaysPicks = () => {
  const [cardItems, setCardItems] = useState([]);
  const { isLoading, isFetching, data, isSuccess } = useQuery({
    queryKey: ['todayspicks'],
    queryFn: () =>
      getRequest("/home/toon-central-originals?filter=all&page=1&limit=10"),
  });
  useEffect(() => {
    if (isSuccess) {
      setCardItems(data?.data?.comics || []);
    }
  }, [isLoading, isFetching, data]);
  return (
    <div className="parent-wrap py-10 block ">
      <div className="child-wrap ">
        <H2SectionTitle title="Today's Picks">
          <Link href="/original">See all</Link>
        </H2SectionTitle>
        <div className="grid grid-cols-3 sm:grid-cols-4  md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {cardItems.map((items, i) => (
            <CardTitleInMobile key={i} cardData={items} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodaysPicks;
