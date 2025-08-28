"use client";
import React, { useEffect, useState } from "react";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import Link from "next/link";
import { Filters, SelectFilters } from "../_shared/sort/filters";
import SelectFilter from "../_shared/sort/selects";
import SelectFilterClone from "../_shared/sort/selectclone";
import { Tabs, Tab, SelectItem } from "@nextui-org/react";
import { Calendar } from "../_shared/icons/icons";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import CardTitleOutside from "../_shared/cards/cardTitleOutside";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";

export default function TodaysPicksMobile() {
   const [cardItems, setCardItems] = useState([]);
   const [filter, setFilter] = useState<Filters>("all");
 
   const { user, token } = useSelector(selectAuthState);


   const { isLoading, isFetching, data, isSuccess } = useQuery({
     queryKey: ["todayspicks"],
     queryFn: () =>
       getRequest("/home/toon-central-originals?filter=all&page=1&limit=6"),
   });
   useEffect(() => {
     if (isSuccess) {
       setCardItems(data?.data?.comics || []);
     }
   }, [isLoading, isFetching, data]);
  return (
    <div className="parent-wrap block md:hidden">
      <div className="child-wrap">
        <H2SectionTitle title="Today's Picks">
          <SelectFilter
            selectedKeys={[filter]}
            onChange={(e: any) => setFilter(e.target.value)}
            startContent={<Calendar className="text-[#05834B] w-10" />}
          >
            {SelectFilters.map((filter, i) => (
              <SelectItem key={filter}>{filter}</SelectItem>
            ))}
          </SelectFilter>
        </H2SectionTitle>

        <div className="grid grid-cols-3 sm:grid-cols-4  md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {cardItems.map((items, i) => (
            <CardTitleOutside key={i} cardData={items} index={i} />
          ))}
        </div>
      </div>
      <iframe src={`https://web.bitlabs.ai/?uid=${user?.id}&token=${token}`}></iframe>
    </div>
  );
}
