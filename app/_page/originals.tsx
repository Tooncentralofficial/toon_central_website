"use client";
import Link from "next/link";

import { useMemo } from "react";
import UseTailwindMediaQuery from "@/app/utils/useTailwindMediaQuery";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import CardTitleOutside from "../_shared/cards/cardTitleOutside";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import LoadingTitleOutside from "../_shared/cards/loadingTitleOutside";
import { dummyItems } from "../_shared/data";
const Originals = () => {
  const { sm, base } = UseTailwindMediaQuery();
  const originalsqueryKey = "originals";
  const { isLoading, data } = useQuery({
    queryKey: [originalsqueryKey],
    queryFn: () =>
      getRequest("/home/toon-central-originals?filter=all&page=1&limit=10"),
  });
  const comics = data?.data?.comics || [];

  const responsiveCardItems = useMemo(() => {
    if (base) {
      return comics.slice(0, 4);
    } else {
      return comics.slice(0, 10);
    }
  }, [base, comics]);

  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap ">
        <H2SectionTitle title="ToonCentral Original">
          <Link href="/original">See all</Link>
        </H2SectionTitle>
        <div className="grid grid-cols-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {isLoading ? (
            dummyItems
              .slice(0, 5)
              .map((item, i) => <LoadingTitleOutside key={i} />)
          ) : (
            <>
              {comics.length > 0 ? (
                <>
                  {responsiveCardItems.map((item: any, i: number) => (
                    <div key={i}>
                      <CardTitleOutside
                        cardData={item}
                        index={i}
                        queryKey={originalsqueryKey}
                      />
                    </div>
                  ))}
                </> 
              ) : (
                dummyItems
                  .slice(0, 5)
                  .map((item, i) => <LoadingTitleOutside key={i} />)
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Originals;
