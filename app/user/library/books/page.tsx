"use client";

import React, { useEffect, useState } from "react";
import ComicTabs from "./_shared/tabs";
import BackButton from "@/app/_shared/layout/back";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import LibraryBookOverview from "./_shared/overview";
import { usePathname } from "next/navigation";

export interface ViewComicProps {
  uid: any;
  data: any;
  comicId: any;
  isLoading: boolean;
}
const Page = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { uuid: any; id: any };
}) => {
  const [comic, setComic] = useState(null);
  const { uuid, id } = searchParams;
  console.log("search", searchParams);
  const uuid2 = new URLSearchParams(window.location.search).get("uuid");
  const id2 = new URLSearchParams(window.location.search).get("id");
  console.log("u;uid",uuid2)
  console.log("id",id2)
  const pathname = usePathname();
  const { token } = useSelector(selectAuthState);
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`comic_${uuid}`],
    queryFn: () =>
      getRequestProtected(`/my-libraries/comics/${Number(id)}/get`, token, pathname),
    enabled: token !== null && id !== null && id !==undefined,
  });
  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      setComic(data?.data || null);
    } else {
      console.log("erre", data);
    }
  }, [data, isFetching, isSuccess]);
  return (
    <main>
      <div className="parent-wrap py-10">
        <div className="child-wrap">
          <BackButton />
          <LibraryBookOverview
            uid={uuid}
            data={comic}
            isLoading={isLoading}
            comicId={id}
          />
          <ComicTabs
            uid={uuid}
            data={comic}
            isLoading={isLoading}
            comicId={id}
          />
        </div>
      </div>
    </main>
  );
};

export default Page;
