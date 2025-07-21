import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading";
  const isUnauthenticated = status === "unauthenticated";

  return {
    session,
    status,
    isAuthenticated,
    isLoading,
    isUnauthenticated,
  };
}