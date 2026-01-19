"use client";

import React, { useEffect, useState } from "react";
import BackButton from "@/app/_shared/layout/back";
import { getRequestProtected, getRequest } from "@/app/utils/queries/requests";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import NotFound from "@/app/user/library/_shared/notFound";
import { usePathname } from "next/navigation";
import { prevRoutes } from "@/lib/session/prevRoutes";
import ShortView from "./_shared/ShortView";

const PageClient = ({ params }: { params: { shortId: string } }) => {
  const pathname = usePathname();
  const [short, setShort] = useState(null);
  const { shortId } = params;
  const { token } = useSelector(selectAuthState);
  const queryKey = `short_${shortId}`;
  console.log("@@shortId", shortId);

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
  console.log("@@short data",data);

  useEffect(() => {
    if (isSuccess && data?.success) {
      setShort(data?.data || null);
    }
  }, [data, isFetching, isSuccess]);
console.log("@@short", short);
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
    <main>
      <div className="parent-wrap py-10">
        <div className="child-wrap">
          <BackButton />
          {!isLoading && (data?.success == false || error) ? (
            <div className="mt-10 flex justify-center min-h-dvh">
              <ErrorComp />
            </div>
          ) : (
            <ShortView
              shortId={shortId}
              data={short}
              isLoading={isLoading}
              queryKey={queryKey}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default PageClient;
