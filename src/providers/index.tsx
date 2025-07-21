"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import NextAuthSessionWrapper from "./next-auth-session-wrapper";
import { RecoilRoot } from "recoil";
import { ChainlitAPI, ChainlitContext } from "@chainlit/react-client";
import envConfig from "@/lib/configs/envConfig";
import { SidebarProvider } from "@/components/ui/sidebar";
import RecoilWrapper from "./recoil-wrapper";
export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = React.useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
          staleTime: 1000 * 60 * 10,
          throwOnError: false,
          refetchOnMount: false,
        },
      },
    })
  ).current;
  const CHAINLIT_SERVER = `${envConfig.CHAINLIT_BACKEND_URL}chat`;
  const apiClient = new ChainlitAPI(CHAINLIT_SERVER, "webapp");

  return (
    <NextAuthSessionWrapper>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <SidebarProvider>{children}</SidebarProvider>
        </RecoilRoot>
      </QueryClientProvider>
    </NextAuthSessionWrapper>
  );
}
