import { getRequest } from '@/app/utils/queries/requests';
import { selectAuthState } from '@/lib/slices/auth-slice';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

function ShortsComponentscontent() {
  const { token } = useSelector(selectAuthState);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const {
    data,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["shorts"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getRequest(
        `home/shorts-carousel?page=${pageParam}&limit=10`
      );

      return {
        shorts: res?.data?.shorts || [],
        nextPage: res?.data?.nextPage || null,
      };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
  });
  const pages = data?.pages ?? [];
  const shorts = pages.flatMap((p) => p?.shorts ?? []);
  const currentShort = shorts[currentIndex] ?? null;
  console.log(currentShort);
  console.log(shorts)
  

  return (
    <div>ShortsComponentscontent</div>
  )
}

export default ShortsComponentscontent