"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth.context";
import { Toaster } from "react-hot-toast";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (
                error instanceof AxiosError &&
                error.response?.status === 401
              ) {
                router.push("/login");
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
