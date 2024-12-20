"use client";

import { useQuery } from "@tanstack/react-query";
import CardTitleTop from "../_shared/cards/cardTitleTop";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import { getRequest } from "../utils/queries/requests";
import LoadingTitleTop from "../_shared/cards/loadingTitleTop";
import { dummyItems } from "../_shared/data";
import { useEffect, useState } from "react";

const Trending = () => {
  const [cardItems, setCardItems] = useState([]);
  const trendingQueryKey = "trending"
  const { isLoading, isFetching, data, isSuccess } = useQuery({
    queryKey: [trendingQueryKey],
    queryFn: () => getRequest("/home/trending?filter=all&page=1&limit=10"),
  });
  console.log(data)
  useEffect(() => {
    if (isSuccess) {
      setCardItems(data?.data?.comics || []);
    }
  }, [isLoading, isFetching, data]);

  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap ">
        <H2SectionTitle title="Trending" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {isLoading ? (
            dummyItems.map((item, i) => <LoadingTitleTop key={i} />)
          ) : (
            <>
              {cardItems?.length > 0 ? (
                <>
                  {" "}
                  {cardItems.map((item: any, i: number) => (
                    <div key={i}>
                      <CardTitleTop 
                      cardData={item} index={i} queryKey={trendingQueryKey}  />
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
