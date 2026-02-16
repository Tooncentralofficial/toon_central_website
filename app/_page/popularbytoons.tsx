"use client";
import React from 'react'
import H2SectionTitle from '../_shared/layout/h2SectionTitle';
import PopularToonscard, { PopularToonscardDesktop } from '../_shared/cards/populartoons';
import { getRequest, getRequestProtected } from '../utils/queries/requests';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth-slice';
import { dummyItems } from '../_shared/data';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Seeall } from '../_shared/icons/icons';
import { adGateToken } from '@/envs';

const PopularByToons = () => {
  const { user,token } = useSelector(selectAuthState);
  const queryKey = "popular_by_toon";
  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      getRequest("/home/popular-by-toon-central?filter=all&page=1&limit=10"),
  });
  const popularItems = data?.data?.comics || dummyItems;
  return (
    <div className="parent-wrap  pt-10">
      <div className="child-wrap">
        <div className="flex justify-between items-center">
          <H2SectionTitle title="Popular by ToonCentral" />
          <Link href={"/trending"} className="mb-4">
            <Seeall />
          </Link>
        </div>
        <div className="flex md:hidden  flex-col gap-5">
          {popularItems.slice(0, 5).map((item, i) => (
            <PopularToonscard key={i} item={item} index={i} />
          ))}
        </div>
        
          <div className="hidden grid-rows-3 grid-flow-col place-content-between gap-y-8 md:grid px-12">
            {popularItems.slice(0, 5).map((item, i) => (
              <PopularToonscardDesktop key={i} item={item} index={i} />
            ))}
          </div>
        
      </div>
      {/* <iframe
        src={`https://web.bitlabs.ai/?uid=${user?.id}&token=${adGateToken}`}
        style={{ width: "200px", height: "600px", border: "none" }}
      ></iframe> */}
    </div>
  );
}

export default PopularByToons