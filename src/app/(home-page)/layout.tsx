// app/layout.tsx
"use client";
import { ReactNode } from "react";
import "./globals.css";
import Providers from "@/providers";
import { Toaster } from "sonner";
import { Suspense } from "react";
import FallbackComponent from "@/components/ui/fallback-component";
import ErrorBoundary from "@/components/customs/error-boundary";
//import { Toaster } from "@/components/ui/toaster";
import LeftSidebar from "@/features/left-sidebar";
import { TaskProgress } from "@/components/customs/task-progress";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <Suspense fallback={<FallbackComponent />}>
            <div className="flex flex-row max-h-screen overflow-hidden flex-1">
              <LeftSidebar />
              <ErrorBoundary>
                <main className="flex flex-1 m-4">{children}</main>
              </ErrorBoundary>
              <TaskProgress />
            </div>
            <Toaster />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
