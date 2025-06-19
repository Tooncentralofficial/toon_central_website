import CardTitleOutside from '@/app/_shared/cards/cardTitleOutside';
import { getRequest } from '@/app/utils/queries/requests';
import { Comic } from '@/helpers/types';
import { Skeleton } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

const YouLike = ({uuid}:{uuid:string}) => {
  const queryKey = "youmaylike";
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [queryKey, uuid],
    queryFn: () =>
      getRequest(
        `/genres/comic/${uuid}/you-may-also-like`
      ),
  });
  const comic = data?.data?.comic
  const comics: Comic[] = data?.data?.comics;
  console.log(comics);
  return (
    <div>
      {comics && (
        <div>
          <p className="text-[1.5rem]">You may like</p>
          <Skeleton
            isLoaded={data !== null}
            className={`${
              data == null && "h-[300px]"
            } bg-secondary my-10 rounded-lg `}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 bg-primary">
              {comics?.map((comic, i) => (
                <CardTitleOutside
                  cardData={comic}
                  index={i}
                  queryKey={queryKey}
                  key={i}
                />
              ))}
            </div>
          </Skeleton>
        </div>
      )}
    </div>
  );
}

export default YouLike