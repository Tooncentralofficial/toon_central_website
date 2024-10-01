"use client";

import React, { useEffect, useState } from "react";
import ComicOverview from "./_shared/overview";
import ComicTabs from "./_shared/tabs";
import BackButton from "@/app/_shared/layout/back";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import NotFound from "@/app/user/library/_shared/notFound";

export interface ViewComicProps {
  uid: any;
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
  const ErrorComp = () => {
    if (data?.data?.action == "SHOW_COMING_SOON_SCREEN")
      return <NotFound title="Coming soon" desc="This comic will soon be published and made available for your viewing. Kindly check back some other time" />;
    if (data?.success == false) return <NotFound title="Comic not found" desc="We can't find the comic you're looking for"/>;
    return <NotFound title="Comic not found" desc="We can't find the comic you're looking for"/>;
  };
  return (
    <main>
      <div className="parent-wrap py-10">
        <div className="child-wrap">
          <BackButton />
          {!isLoading && data?.success == false ? (
            <div className="mt-10 flex justify-center min-h-dvh">
              <ErrorComp />
            </div>
          ) : (
            <>
              <ComicOverview uid={uid} data={comic} isLoading={isLoading} />
              <ComicTabs uid={uid} data={comic} isLoading={isLoading} />
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
