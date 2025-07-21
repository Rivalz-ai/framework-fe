"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetTasks } from "@/hooks/apis/tasks";
import Chat from "../chat-v2";

export default function ThreadContentClient() {
  const [chatKey, setChatKey] = useState(0);
  const params = useParams();
  const slug = params.slug as string;

  const { refetchListTasks } = useGetTasks("rx", slug);
  //const isCurrentThread = threadId === slug;

  const isNewChat = !slug || window.location.pathname === "/";

  // useEffect(() => {
  //   console.log("Thread slug changed to:", slug);
  //   setChatKey((prevKey) => prevKey + 1);
  // }, [slug]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     console.log("Setting thread history, currentThreadId:", slug);
  //     if (slug) {
  //       refetchListTasks();
  //     }
  //     setThreadHistory((prev) => {
  //       if (isNewChat) {
  //         return { ...prev, currentThreadId: undefined };
  //       }

  //       if (prev?.currentThreadId === slug) return prev;
  //       return { ...prev, currentThreadId: slug };
  //     });
  //   }
  // }, [slug, setThreadHistory, isNewChat]);

  // useEffect(() => {
  //   console.log("Current thread state:", {
  //     isCurrentThread,
  //     threadId,
  //     slug,
  //     chatKey,
  //     isNewChat,
  //   });
  // }, [isCurrentThread, threadId, slug, chatKey, isNewChat]);

  return (
    <div
      className={cn("flex flex-1 flex-col gap-5 px-[16px] h-full", "lg:px-0")}
    >
      {/* {config?.threadResumable && !isCurrentThread && !isNewChat ? (
        <AutoResumeThread id={slug} key={chatKey} />
      ) : null}

      {config?.threadResumable ? (
        isCurrentThread ? (
          <Chat key={chatKey} />
        ) : (
          // <div className="flex flex-grow items-center justify-center">
          //   <Loader className="!size-6" />
          // </div>
          <ReadOnlyThread id={slug} key={chatKey} />
        )
      ) : isCurrentThread || isNewChat ? (
        <Chat key={chatKey} />
      ) : (
        <ReadOnlyThread id={slug} key={chatKey} />
      )} */}
      <Chat key={chatKey} projectId={""} currentThreadIdState={slug} />
    </div>
  );
}
