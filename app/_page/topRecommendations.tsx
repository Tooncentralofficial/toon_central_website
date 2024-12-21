"use client";

import { useEffect, useMemo, useState } from "react";
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

  return (
    <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {isLoading ? (
        dummyItems.map((item, i) => <LoadingTitleTop key={i} />)
      ) : (
        <>
          {cardItems?.length > 0 ? (
            <>
              {cardItems.slice(0, sliced).map((item: any, i: number) => (
                <div key={i} >
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
