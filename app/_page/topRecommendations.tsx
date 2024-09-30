"use client";

import { useMemo } from "react";
import CardTitleTop from "../_shared/cards/cardTitleTop";
import { RecommendedTabProps } from "./recommendtnTabs";
import { dummyItems } from "../_shared/data";
import LoadingTitleTop from "../_shared/cards/loadingTitleTop";

const TopRecommendations = ({
  isLoading,
  isFetching,
  data,
}: RecommendedTabProps) => {
  const cardItems = useMemo(() => data, [isLoading, isFetching, data]);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {isLoading ? (
        dummyItems.map((item, i) => <LoadingTitleTop key={i} />)
      ) : (
        <>
          {cardItems?.length > 0 ? (
            <>
              {" "}
              {cardItems.slice(0, 10).map((item: any, i: number) => (
                <div key={i}>
                  <CardTitleTop cardData={item} index={i} />
                </div>
              ))}
            </>
          ) : (
            dummyItems.map((item, i) => <LoadingTitleTop key={i} />)
          )}
        </>
      )}
    </div>
  );
};

export default TopRecommendations;
