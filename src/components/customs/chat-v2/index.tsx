"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatFooter from "./footer";
import ScrollContainer from "./scroll-container";
import MessagesContainer from "./messages-container";
import { IStep } from "@/types/step-type";
import { Loader } from "@/components/customs/loader";
import { useCreateThread, useGetSteps } from "@/hooks/apis/chatbot/threads";
import { useSendMessage } from "@/hooks/apis/chatbot/chat";
import { useConfigurationStore } from "@/stores/use-global-state";

export interface ChatProps {
  projectId: string;
  currentThreadIdState?: string;
}

const Chat = ({ projectId, currentThreadIdState }: ChatProps) => {
  const autoScrollRef = useRef(true);

  //States
  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(100);
  const [threadId, setThreadId] = useState<string>(currentThreadIdState || "");
  const [messages, setMessages] = useState<IStep[]>([]);
  const { config } = useConfigurationStore();

  //Queries
  const { listSteps, isListStepsLoading } = useGetSteps(
    currentThreadIdState || "",
    skip,
    limit
  );

  //Mutations
  const { createThreadAsync, isCreatingThread } = useCreateThread();
  const { sendMessageAsync, isSendingMessage } = useSendMessage();
  //Effect
  useEffect(() => {
    if (currentThreadIdState && listSteps) {
      const results: IStep[] = [];
      listSteps.forEach((history) => {
        switch (history.type) {
          case "USER_MESSAGE":
            const ask: IStep = {
              type: "user_message",
              output: history.input!,
              id: history.id,
              name: history.name,
              createdAt: history.createdAt,
            };
            results.push(ask);
            break;

          default:
            const answer: IStep = {
              type: "assistant_message",
              output: history.output!,
              id: history.id,
              name: history.name,
              createdAt: history.createdAt,
            };
            results.push(answer);
            break;
        }
      });
      setMessages(results);
    }
  }, [listSteps]);

  const handleSubmit = async (message: string) => {
    let tempMessage = [...messages];
    tempMessage.push({
      type: "user_message",
      output: message,
      id: uuidv4(),
      name: "",
      createdAt: "",
    });
    setMessages(tempMessage);

    autoScrollRef.current = true;
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const thread = await createThreadAsync({
        name: message,
        tags: [],
        metadata: {},
      });
      setThreadId(thread.id);
      currentThreadId = thread.id;
    }

    const bodyMessage = {
      thread_id: currentThreadId,
      message: message,
      agent_type: "rx",
    };

    const response = await sendMessageAsync({ ...bodyMessage, ...config });
    tempMessage.push({
      type: "assistant_message",
      output: response.ai_response[0],
      id: response.ai_steps[0].id,
      name: response.ai_steps[0].name,
      createdAt: response.ai_steps[0].createdAt,
    });
    setMessages(tempMessage);
  };

  const isSubmitting = useMemo(() => {
    if (isCreatingThread || isSendingMessage) {
      return true;
    }
    return false;
  }, [isCreatingThread, isSendingMessage]);

  return (
    <div className="flex flex-col w-full h-full">
      <ScrollContainer
        autoScrollUserMessage={true}
        autoScrollRef={autoScrollRef}
        messages={messages}
        className="flex-1"
      >
        <div className="flex flex-col mx-auto w-full h-full">
          <div className="flex flex-col">
            <MessagesContainer messages={messages} />
            {isSendingMessage && <Loader className="size-6" />}
          </div>
          {isListStepsLoading && (
            <div className="flex flex-col mx-auto w-full h-full justify-center items-center">
              <Loader className="w-10 h-10 text-rivalz-text-primary" />
            </div>
          )}
        </div>
      </ScrollContainer>
      <div className="flex flex-col mx-auto w-full pt-0">
        <ChatFooter
          autoScrollRef={autoScrollRef}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default Chat;
