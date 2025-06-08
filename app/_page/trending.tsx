"use client";

import { useQuery } from "@tanstack/react-query";
import CardTitleTop from "../_shared/cards/cardTitleTop";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import { getRequest } from "../utils/queries/requests";
import LoadingTitleTop from "../_shared/cards/loadingTitleTop";
import { dummyItems } from "../_shared/data";
import { useEffect, useState } from "react";
import { Seeall } from "../_shared/icons/icons";
import Link from "next/link";

const Trending = () => {
  const [cardItems, setCardItems] = useState([]);
  const trendingQueryKey = "trending"
  const { isLoading, isFetching, data, isSuccess } = useQuery({
    queryKey: [trendingQueryKey],
    queryFn: () => getRequest("/home/trending?filter=all&page=1&limit=10"),
  });
  const [sliced, setSliced] = useState<number>(10);
  useEffect(() => {
    const updateSliced = () => {
      if (window.matchMedia("(max-width: 540px)").matches) {
        setSliced(3);
      } else if (window.matchMedia("(max-width: 1024px)").matches) {
        setSliced(6);
      } else {
        setSliced(10);
      }
    };

    updateSliced();

    const resizeListener = () => updateSliced();
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);
  useEffect(() => {
    if (isSuccess) {
      setCardItems(data?.data?.comics || []);
    }
  }, [isLoading, isFetching, data]);

  return (
    <div className="parent-wrap py-10 hidden">
      <div className="child-wrap hidden md:block">
        <div className=" flex justify-between items-center">
          <H2SectionTitle title="Trending" />
          <Link href={"/trending"}>
            <Seeall />
          </Link>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {isLoading ? (
            dummyItems.map((item, i) => <LoadingTitleTop key={i} />)
          ) : (
            <>
              {cardItems?.length > 0 ? (
                <>
                  {" "}
                  {cardItems.slice(0, sliced).map((item: any, i: number) => (
                    <div key={i}>
                      <CardTitleTop
                        cardData={item}
                        index={i}
                        queryKey={trendingQueryKey}
                      />
                    </div>
                  ))}
                </>
              ) : (
                dummyItems.map((item, i) => <LoadingTitleTop key={i} />)
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trending;
