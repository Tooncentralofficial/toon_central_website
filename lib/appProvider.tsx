"use client";

import NavHome from "@/app/_shared/layout/nav";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { Store } from "./store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import Mainfooter from "@/app/_shared/layout/footermain";
import MainfooterWithDelay from "@/app/_shared/layout/footermain";
// import { Provider } from "react-redux";
// import { Store } from "./store";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
function getPreferredTheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export default function AppProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  useEffect(() => {
    const preferredTheme = getPreferredTheme();
    document.documentElement.setAttribute("data-theme", preferredTheme);
  }, []);
  return (
    <NextUIProvider>
      <Provider store={Store}>
        <QueryClientProvider client={queryClient}>
          <NavHome />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.75 }}
          >
            {children}
            <ToastContainer />
            <ReactQueryDevtools initialIsOpen={false} />
          </motion.div>
        </QueryClientProvider>
      </Provider>
    </NextUIProvider>
  );
}
