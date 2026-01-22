"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getRequestProtected, getRequest } from "@/app/utils/queries/requests";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import NotFound from "@/app/user/library/_shared/notFound";
import { usePathname } from "next/navigation";
import { prevRoutes } from "@/lib/session/prevRoutes";
import ShortView from "./_shared/ShortView";

const PageClient = ({ params }: { params: { shortId: string } }) => {
  const pathname = usePathname();
  const [short, setShort] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { shortId } = params;
  const { token } = useSelector(selectAuthState);
  const queryKey = `short_${shortId}`;

  // Fetch all shorts with infinite query
  const {
    data: shortsData,
    isSuccess: shortsSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: shortsLoading,
  } = useInfiniteQuery({
    queryKey: ["shorts"],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await getRequest(
          `shorts/${shortId}/infinite-view`
        );

        const pagination = res?.data?.pagination;
        const current = pagination?.currentPage ?? 1;
        const total = pagination?.totalPages ?? 1;
        const nextPage =
          current && total && current < total ? current + 1 : null;

        return {
          shorts: Array.isArray(res?.data?.shorts) ? res.data.shorts : [],
          nextPage,
        };
      } catch (error) {
        console.error("Error fetching shorts:", error);
        return {
          shorts: [],
          nextPage: null,
        };
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages?.length ? allPages?.length + 1 : 1;
      return lastPage?.nextPage ? nextPage : undefined;
    },
  });
 

  // Extract shorts array from pages
  const pages = Array.isArray(shortsData?.pages) ? shortsData.pages : [];
  const shorts = useMemo(() => {
    return Array.isArray(pages)
      ? pages.flatMap((p) => (p && Array.isArray(p.shorts) ? p.shorts : []))
      : [];
  }, [pages]);

  // Find current short index in the shorts array
  useEffect(() => {
    if (shorts.length > 0 && shortId) {
      const index = shorts.findIndex(
        (s: any) => s?.uuid === shortId || s?.id?.toString() === shortId
      );
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [shorts, shortId]);

  // Try with authentication first, fallback to public if needed
  const { data, isLoading, isFetching, isSuccess, error } = useQuery({
    queryKey: [queryKey],
    queryFn: () => {
        return getRequestProtected(
          `shorts/${shortId}/view`,
          token,
          pathname
        );
      
    },
    enabled: !!shortId,
    retry: 1,
  });


  useEffect(() => {
    if (isSuccess && data?.success) {
      setShort(data?.data || null);
    }
  }, [data, isFetching, isSuccess]);
  const ErrorComp = () => {
    if (data?.success == false || error) {
      return (
        <NotFound
          title="Short not found"
          desc="We can't find the short you're looking for. It may have been removed or the link is incorrect."
        />
      );
    }
    return (
      <NotFound
        title="Short not found"
        desc="We can't find the short you're looking for"
      />
    );
  };

  return (
    <main
      className="bg-[var(--bg-primary)] overflow-hidden h-[100vh] w-full p-0 m-0 relative"
      style={{
        minHeight: "100vh",
      }}
    >
      <div className="h-full w-full overflow-hidden">
        {!isLoading && (data?.success == false || error) ? (
          <div className="flex justify-center items-center min-h-dvh">
            <ErrorComp />
          </div>
        ) : (
          <ShortView
            shortId={shortId}
            data={short}
            isLoading={isLoading}
            queryKey={queryKey}
            shorts={shorts}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            shortsLoading={shortsLoading}
          />
        )}
      </div>
    </main>
  );
};

export default PageClient;
