import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import Originals from "../original/originals";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import NotificationPanel from "./_components/NotificationPanel";
import ClientPage from "./clientpage";

export default function Notification() {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <div className="parent-wrap py-10">
          <div className="child-wrap min-h-screen  w-full">
            <ClientPage />
          </div>
        </div>
      </main>
    </HydrationBoundary>
  );
}
