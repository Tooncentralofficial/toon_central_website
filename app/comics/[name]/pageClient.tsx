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
import { usePathname } from "next/navigation";

export interface ViewComicProps {
  uid: any;
  data: any;
  isLoading: boolean;
  queryKey: string;
}
const PageClient = ({ params }: { params: { name: string } }) => {
  const pathname = usePathname();
  const [comic, setComic] = useState(null);
  const { name } = params;
  const { token } = useSelector(selectAuthState);
  const queryKey = `comic_${name}`;
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [queryKey],
    queryFn: () => getRequestProtected(`/comics/${name}/view`, token, pathname),
    enabled: token !== null,
  });
  useEffect(() => {
    if (isSuccess) setComic(data?.data || null);
  }, [data, isFetching, isSuccess]);
  const ErrorComp = () => {
    if (data?.data?.action == "SHOW_COMING_SOON_SCREEN")
      return (
        <NotFound
          title="Coming soon"
          desc="This comic will soon be published and made available for your viewing. Kindly check back some other time"
        />
      );
    if (data?.success == false)
      return (
        <NotFound
          title="Comic not found"
          desc="We can't find the comic you're looking for"
        />
      );
    return (
      <NotFound
        title="Comic not found"
        desc="We can't find the comic you're looking for"
      />
    );
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
              <ComicOverview
                uid={name}
                data={comic}
                isLoading={isLoading}
                queryKey={queryKey}
              />
              <ComicTabs
                uid={name}
                data={comic}
                isLoading={isLoading}
                queryKey={queryKey}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default PageClient;
