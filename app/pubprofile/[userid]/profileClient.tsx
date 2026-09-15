"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/app/utils/queries/requests";
import ProfileHeader from "./_shared/ProfileHeader";
import ContentTabs from "./_shared/ContentTabs";
import { Skeleton } from "@nextui-org/react";
import NotFound from "@/app/user/library/_shared/notFound";

const ProfileClient = ({ params }: { params: { userid: string } }) => {
  const [profile, setProfile] = useState<any>(null);
  const { userid } = params;
  const queryKey = `profile_${userid}`;

  const { data, isLoading, isFetching, isSuccess, isError } = useQuery({
    queryKey: [queryKey],
    queryFn: () => getRequest(`/profile/${userid}/view`),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  useEffect(() => {
    if (isSuccess && data?.success) {
      setProfile(data?.data || null);
    }
  }, [data, isFetching, isSuccess]);

  const ErrorComp = () => {
    if (data?.success === false || isError) {
      return (
        <NotFound
          title="Profile not found"
          desc="We can't find the creator profile you're looking for"
        />
      );
    }
    return (
      <NotFound
        title="Profile not found"
        desc="We can't find the creator profile you're looking for"
      />
    );
  };

  return (
    <main>
      <div className="parent-wrap py-10">
        <div className="child-wrap">
          {!isLoading && (data?.success === false || isError) ? (
            <div className="mt-10 flex justify-center min-h-dvh">
              <ErrorComp />
            </div>
          ) : (
            <>
              <ProfileHeader
                data={profile}
                isLoading={isLoading}
                userid={userid}
                queryKey={queryKey}
              />
              <ContentTabs
                data={profile}
                isLoading={isLoading}
                userid={userid}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfileClient;
