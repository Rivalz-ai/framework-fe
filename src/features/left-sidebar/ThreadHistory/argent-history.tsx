import React, { useContext, useEffect, useState } from "react";
import { ThreadList } from "../ThreadList";
import { uniqBy } from "lodash";
import { useGetThreads } from "@/hooks/apis/chatbot/threads";
import { IListThreadsResponse, IThread } from "@/types/thread-type";

const _scrollTop = 0;
const BATCH_SIZE = 20;

interface ArgentHistoryProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}

export default function ArgentHistory({ scrollRef }: ArgentHistoryProps) {
  const [error, setError] = useState<string>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [shouldLoadMore, setShouldLoadMore] = useState(false);
  const [threadHistory, setThreadHistory] = useState<IListThreadsResponse>();
  const { getThreadsAsync, isGettingThreads } = useGetThreads();
  //const [{ swarmSelected }] = useGlobalStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = _scrollTop;
    }
  }, [scrollRef]);

  const fetchThreads = async (cursor?: string, isLoadingMore = false) => {
    console.log("cursor", cursor);

    try {
      setIsLoadingMore(!!cursor || isLoadingMore);
      setIsFetching(!cursor && !isLoadingMore);

      const { pageInfo, data } = await getThreadsAsync({
        first: BATCH_SIZE,
        cursor,
      });

      setError(undefined);

      // Prevent duplicate threads
      const allThreads = uniqBy(
        cursor ? threadHistory?.data.concat(data) : data,
        "id"
      );

      if (allThreads) {
        setThreadHistory({
          ...threadHistory,
          data: allThreads,
          pageInfo,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setShouldLoadMore(false);
      setIsLoadingMore(false);
      setIsFetching(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!isFetching && !threadHistory && !error) {
      fetchThreads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, threadHistory, error]);

  // // Handle infinite scroll
  // useEffect(() => {
  //   if (threadHistory?.pageInfo) {
  //     const { hasNextPage, endCursor } = threadHistory.pageInfo;
  //     console.log("hasNextPage", hasNextPage);
  //     console.log("endCursor", endCursor);

  //     if (shouldLoadMore && !isLoadingMore && hasNextPage && endCursor) {
  //       console.log("endCursor", endCursor);

  //       fetchThreads(endCursor);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [shouldLoadMore, isLoadingMore, threadHistory]);

  return (
    <>
      {!isGettingThreads ? (
        <div id="thread-history" className="flex-grow ">
          <ThreadList
            onThreadHistoryChange={(threads) => setThreadHistory(threads)}
            listThreads={threadHistory}
            threadHistory={threadHistory?.data}
            error={error}
            isFetching={isGettingThreads}
            isLoadingMore={isLoadingMore}
          />
        </div>
      ) : null}
    </>
  );
}
