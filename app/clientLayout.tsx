"use client";

import AppProvider from "@/lib/appProvider";
import { NotificationBootstrap } from "./_shared/notificationBootstrap";
// import { useLayoutEffect, useState } from "react";
const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProvider>
      <NotificationBootstrap />
      {children}
    </AppProvider>
  );
};

export default ClientLayout;
