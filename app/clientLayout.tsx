"use client";

import AppProvider from "@/lib/appProvider";
import { useLayoutEffect, useState } from "react";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);
  useLayoutEffect(() => setIsClient(true), []);
  return (
    <>
      {isClient ? (
        <AppProvider>{children}</AppProvider>
      ) : (
        <div className="h-full w-full flex justify-center bg-[var(--bg-primary)]"></div>
      )}
    </>
  );
};

export default ClientLayout;
