"use client";

import { MessageContext } from "@/contexts/message-context";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  ChainlitContext,
  IAction,
  IFeedback,
  IMessageElement,
  IStep,
  IThread,
  nestMessages,
  sideViewState,
  useApi,
  useConfig,
} from "@chainlit/react-client";

import { useLayoutMaxWidth } from "@/hooks/use-layout-max-width";

import ErrorBoundary from "./error-boundary";
import { Loader } from "./loader";
import { Messages } from "./chat/message/base";

type Props = {
  id: string;
};

const ReadOnlyThread = ({ id }: Props) => {
  const router = useRouter();
  const { config } = useConfig();
  const {
    data: thread,
    error: threadError,
    isLoading,
  } = useApi<IThread>(id ? `/project/thread/${id}` : null, {
    revalidateOnFocus: false,
  });
  const setSideView = useSetRecoilState(sideViewState);
  const [steps, setSteps] = useState<IStep[]>([]);
  const apiClient = useContext(ChainlitContext);
  const layoutMaxWidth = useLayoutMaxWidth();

  useEffect(() => {
    if (!thread) {
      setSteps([]);
      return;
    }
    setSteps(thread.steps);
  }, [thread]);

  useEffect(() => {
    if (threadError) {
      router.push("/");
      toast.error("Failed to load thread: " + threadError.message);
    }
  }, [threadError, router]);

  const onElementRefClick = useCallback(
    (element: IMessageElement) => {
      if (element.display === "side") {
        setSideView({ title: element.name, elements: [element] });
        return;
      }

      let path = `/element/${element.id}`;

      if (element.threadId) {
        path += `?thread=${element.threadId}`;
      }

      return router.push(element.display === "page" ? path : "#");
    },
    [setSideView, router]
  );

  const onFeedbackUpdated = useCallback(
    async (message: IStep, onSuccess: () => void, feedback: IFeedback) => {
      toast.promise(apiClient.setFeedback(feedback), {
        loading: "Updating",
        success: (res) => {
          setSteps((prev) =>
            prev.map((step) => {
              if (step.id === message.id) {
                return {
                  ...step,
                  feedback: {
                    ...feedback,
                    id: res.feedbackId,
                  },
                };
              }
              return step;
            })
          );

          onSuccess();
          return "Feedback updated!";
        },
        error: (err) => {
          return <span>{err.message}</span>;
        },
      });
    },
    [setSteps]
  );

  const onFeedbackDeleted = useCallback(
    async (message: IStep, onSuccess: () => void, feedbackId: string) => {
      toast.promise(apiClient.deleteFeedback(feedbackId), {
        loading: "updating",
        success: () => {
          setSteps((prev) =>
            prev.map((step) => {
              if (step.id === message.id) {
                return {
                  ...step,
                  feedback: undefined,
                };
              }
              return step;
            })
          );

          onSuccess();
          return "updated";
        },
        error: (err) => {
          return <span>{err.message}</span>;
        },
      });
    },
    [setSteps]
  );

  const onError = useCallback((error: string) => toast.error(error), [toast]);

  const elements = thread?.elements || [];
  const actions: IAction[] = [];
  const messages = nestMessages(steps);

  const memoizedContext = useMemo(() => {
    return {
      allowHtml: config?.features?.unsafe_allow_html,
      latex: config?.features?.latex,
      editable: false,
      loading: false,
      showFeedbackButtons: !!config?.dataPersistence,
      uiName: config?.ui?.name || "",
      cot: config?.ui?.cot || "hidden",
      onElementRefClick,
      onError,
      onFeedbackUpdated,
      onFeedbackDeleted,
    };
  }, [
    config?.ui?.name,
    config?.ui?.cot,
    config?.features?.unsafe_allow_html,
    onElementRefClick,
    onError,
    onFeedbackUpdated,
    onFeedbackDeleted,
  ]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center">
        <Loader className="!size-6" />
      </div>
    );
  }

  if (!thread) {
    return null;
  }

  return (
    <div className="flex max-h-screen py-6 w-full flex-col flex-grow relative overflow-y-auto scrollbar-thin scrollbar-thumb-[#373A40] scrollbar-track-transparent ">
      <ErrorBoundary>
        <MessageContext.Provider value={memoizedContext}>
          <div
            className="flex flex-col mx-auto w-full flex-grow p-4"
            style={{
              maxWidth: layoutMaxWidth,
            }}
          >
            <Messages
              indent={0}
              messages={messages}
              elements={elements as any}
              actions={actions}
            />
          </div>
        </MessageContext.Provider>
      </ErrorBoundary>
    </div>
  );
};

export { ReadOnlyThread };
