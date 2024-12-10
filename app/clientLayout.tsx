"use client";

import AppProvider from "@/lib/appProvider";
import { useLayoutEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MainfooterWithDelay from "./_shared/layout/footermain";
const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);
  useLayoutEffect(() => setIsClient(true), []);
  return (
    <>
      {isClient ? (
        <AppProvider>
          <DndProvider backend={HTML5Backend}>{children}
          
          </DndProvider>
        </AppProvider>
      ) : (
        <div className="h-full w-full flex justify-center bg-[var(--bg-primary)]"></div>
      )}
    </>
  );
};

export default ClientLayout;
