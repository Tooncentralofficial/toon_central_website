"use client";

import AppProvider from "@/lib/appProvider";
// import { useLayoutEffect, useState } from "react";
const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
};

export default ClientLayout;
