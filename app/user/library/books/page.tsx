"use client";

import React, { useEffect, useState } from "react";
import ComicTabs from "./_shared/tabs";
import BackButton from "@/app/_shared/layout/back";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import LibraryBookOverview from "./_shared/overview";

export interface ViewComicProps {
  uid: any;
  data: any;
  comicId:any;
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
  const { uuid,id } = searchParams;
  
  const { token } = useSelector(selectAuthState);
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`comic_${uuid}`],
    queryFn: () => getRequestProtected(`/my-libraries/comics/${id}/get`, token),
    enabled: token !== null,
  });
  useEffect(() => {
    if (isSuccess) setComic(data?.data || null);
  }, [data, isFetching, isSuccess]);
  console.log(data)
  "App\Http\Controllers\ComicController::getComicsById(): Argument #2 ($comicId) must be of type int, string given, called in /home/tooncent/devapi.tooncentralhub.com/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php on line 46";
  return (
    <main>
      <div className="parent-wrap py-10">
        <div className="child-wrap">
          <BackButton />
          <LibraryBookOverview uid={uuid} data={comic} isLoading={isLoading} comicId={id}/>
          <ComicTabs uid={uuid} data={comic} isLoading={isLoading} comicId={id} />
        </div>
      </div>
    </main>
  );
};

export default Page;
