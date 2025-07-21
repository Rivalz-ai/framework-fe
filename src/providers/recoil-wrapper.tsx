"use client";
import { useShowToast } from "@/hooks/commons/use-toast";
import { useAuth } from "@/hooks/use-auth";
import envConfig from "@/lib/configs/envConfig";
import { useGlobalStore } from "@/stores";
import {
  ChainlitContext,
  currentThreadIdState,
  sessionState,
  threadHistoryState,
  threadIdToResumeState,
  useChatInteract,
  useChatMessages,
  useChatSession,
} from "@chainlit/react-client";
import { uniqBy } from "lodash";
import React, { useContext, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const RecoilWrapper = ({ children }: { children: React.ReactNode }) => {
  const userEnv = {};
  const apiClient = useContext(ChainlitContext);
  const { onToastSuccess, onToastError } = useShowToast();
  const { connect, disconnect } = useChatSession();
  const idToResume = useRecoilValue(threadIdToResumeState);
  const session = useRecoilValue(sessionState);
  const [{ swarmSelected }] = useGlobalStore();
  const [threadHistory, setThreadHistory] = useRecoilState(threadHistoryState);

  const setCurrentThreadId = useSetRecoilState(currentThreadIdState);
  const { clear, setIdToResume } = useChatInteract();
  useEffect(() => {
    if (!swarmSelected?.project_id) return;

    const connectToChat = async () => {
      try {
        if (session?.socket.connected) {
          session.socket.disconnect();
        }
        //console.log(`Disconnected from ${swarmSelected.project_name}`);
        await fetch(`${envConfig.CHAINLIT_BACKEND_URL}custom-auth`, {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "X-Chainlit-Thread-Id": idToResume || "",
          },
          body: JSON.stringify({
            project_id: swarmSelected.project_id,
            project_name: swarmSelected.project_name,
          }),
          credentials: "include",
        });
        // const cursor = undefined;
        // const { pageInfo, data } = await apiClient.listThreads(
        //   { first: 35, cursor: cursor },
        //   {}
        // );

        // // Prevent duplicate threads
        // const allThreads = uniqBy(
        //   cursor ? threadHistory?.threads?.concat(data) : data,
        //   "id"
        // );
        // if (allThreads) {
        //   setThreadHistory((prev) => ({
        //     ...prev,
        //     pageInfo,
        //     threads: allThreads,
        //   }));
        // }
        // Disconnect existing connection if any

        disconnect();
        clear();
        setThreadHistory((prev) => ({
          ...prev,
          threads: undefined,
        }));
        setIdToResume(undefined);
        setCurrentThreadId(undefined);
        // Connect with new project
        connect({ userEnv });
        // onToastSuccess(`Connected to ${swarmSelected.project_name}`);
      } catch (error) {
        // onToastError("Failed to connect to chat");
      }
    };

    connectToChat();
  }, [swarmSelected]);
  return <>{children}</>;
};

export default RecoilWrapper;
