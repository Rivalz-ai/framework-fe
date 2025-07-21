"use client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/use-auth";
const ThreadContentClient = dynamic(
  () => import("@/components/customs/thread/thread-content-client"),
  {
    ssr: false,
  }
);
export default function ThreadDetails() {
  const router = useRouter();
  const { isUnauthenticated } = useAuth();
  if (isUnauthenticated) {
    router.push("/");
  }
  return (
    <div className="flex flex-1 flex-col">
      <ThreadContentClient />
    </div>
  );
}
