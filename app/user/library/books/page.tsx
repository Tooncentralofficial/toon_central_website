"use client";

import React, { useEffect, useState } from "react";
import ComicTabs from "./_shared/tabs";
import BackButton from "@/app/_shared/layout/back";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import LibraryBookOverview from "./_shared/overview";
import { usePathname, useSearchParams } from "next/navigation";
import { prevRoutes } from "@/lib/session/prevRoutes";

export interface ViewComicProps {
  uid: any;
  data: any;
  comicId: any;
  isLoading: boolean;
}
const Page = ({
  params,
  searchParams: _searchParams,
}: {
  params: { slug: string };
  searchParams: { uuid: any; id: any };
}) => {
  const searchParams = useSearchParams();
  const [comic, setComic] = useState(null);
  const uuid2 = searchParams.get("uuid");
  const id2 = searchParams.get("id");

  const pathname = usePathname();
  const { token } = useSelector(selectAuthState);
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`comic_${uuid2}`, id2],
    queryFn: () =>
      getRequestProtected(
        `/my-libraries/comics/${Number(id2)}/get`,
        token,
        prevRoutes().library
      ),
    enabled: token !== null && id2 != null,
  });
  useEffect(() => {
    if (isSuccess) {
      setComic(data?.data || null);
    }
  }, [data, isFetching, isSuccess]);
  return (
    <main>
      <div className="parent-wrap py-10">
        <div className="child-wrap">
          <BackButton />
          <LibraryBookOverview
            uid={uuid2}
            data={comic}
            isLoading={isLoading}
            comicId={id2}
          />
          <ComicTabs
            uid={uuid2}
            data={comic}
            isLoading={isLoading}
            comicId={id2}
          />
        </div>
      </div>
    </main>
  );
};

export default Page;
