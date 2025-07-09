import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import Originals from "../original/originals";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import NotificationPanel from "./_components/NotificationPanel";

export default function Notification() {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <div className="parent-wrap py-10">
          <div className="child-wrap min-h-screen  w-full">
            <H2SectionTitle title="Notifications" />
            <div className="flex flex-col gap-5 mt-5">
              {Array(10)
                .fill(0)
                .map((item, i) => (
                  <NotificationPanel key={i} />
                ))}
              
            </div>
          </div>
        </div>
      </main>
    </HydrationBoundary>
  );
}
