"use client";

import React, { useEffect, useState } from "react";
import ComicOverview from "./_shared/overview";
import ComicTabs from "./_shared/tabs";
import BackButton from "@/app/_shared/layout/back";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";

export interface ViewComicProps {
  uid:any
  data: any;
  isLoading: boolean;
}
const Page = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const [comic, setComic] = useState(null);
  const { uid } = searchParams;
  const { token } = useSelector(selectAuthState);
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`comic_${uid}`],
    queryFn: () => getRequestProtected(`/comics/${uid}/view`, token),
    enabled: token !== null,
  });
  useEffect(() => {
    if (isSuccess) setComic(data?.data || null);
  }, [data, isFetching, isSuccess]);

  return (
    <main>
      <div className="parent-wrap py-10">
        <div className="child-wrap">
          <BackButton />
          <ComicOverview uid={uid} data={comic} isLoading={isLoading} />
          <ComicTabs uid={uid} data={comic} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
};

export default Page;
