"use client";
import React, { useEffect, useState } from 'react'
import H2SectionTitle from '../_shared/layout/h2SectionTitle';
import PopularToonscard from '../_shared/cards/populartoons';
import { getRequest, getRequestProtected } from '../utils/queries/requests';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth-slice';
import { dummyItems } from '../_shared/data';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Seeall } from '../_shared/icons/icons';

const PopularByToons = () => {
  const [popularItems, setPopularItems] = useState<any[]>([]);
  const {  token } = useSelector(selectAuthState);
  const queryKey = "popular_by_toon";
  const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      getRequest("/home/popular-by-toon-central?filter=all&page=1&limit=5"),
  });
  useEffect(() => {
    setPopularItems(dummyItems);
    if (isSuccess) {
      setPopularItems(data?.data?.comics || dummyItems);
    }
  }, [isLoading, isFetching, data]);
  return (
    <div className="parent-wrap pt-10 md:py-10 md:pt-0  block md:hidden">
      <div className="child-wrap">
        <div className="flex justify-between items-center">
          <H2SectionTitle title="Popular by ToonCentral" />
          <Link href={"/trending"} className='mb-4'>
            <Seeall />
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          {popularItems.slice(0,5).map((item, i) => (
            <PopularToonscard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PopularByToons