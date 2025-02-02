import CardTitleOutside from '@/app/_shared/cards/cardTitleOutside';
import { getRequest } from '@/app/utils/queries/requests';
import { Comic, User } from '@/helpers/types';
import { Skeleton } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

const OtherBooks = ({creator}:{creator:User}) => {
 const queryKey = "other_books"
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [queryKey, creator?.id],
    queryFn: () => getRequest(`/comics/${creator?.id}/pull?page=1&limit=5`),
  });
  const comics:Comic[] = data?.data?.comics
 
  return (
    <div>
      <p className="text-[1.5rem]">Other books by {creator?.username}</p>
      <Skeleton
        isLoaded={data !== null}
        className={`${
          data == null && "h-[300px]"
        } bg-secondary my-10 rounded-lg `}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 bg-primary">
          {comics?.map((comic, i) => (
            <CardTitleOutside cardData={comic} index={i} queryKey={queryKey} key={i}/>
          ))}
        </div>
      </Skeleton>
    </div>
  );
}

export default OtherBooks