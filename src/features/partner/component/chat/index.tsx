"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import ChatFooter from "./footer";
import ScrollContainer from "./scroll-container";
import MessagesContainer from "./messages-container";
import {
  useGetModelQuery,
  useCreateThreadMutation,
  useCreateTaskMutation,
  useGetHistoryQuery,
} from "../../hooks/api";
import { DropdownItemProps } from "@/components/customs/dropdown-icon-custom";
import { TaskModel, ThreadModel } from "@/types/partner-type";
import { IStep } from "@/types/step-type";
import { useSession } from "next-auth/react";
import { Loader } from "@/components/customs/loader";

export interface ChatProps {
  partnerId: string;
  argentName: string;
  id?: string;
}

const Chat = ({ partnerId, argentName, id }: ChatProps) => {
  const autoScrollRef = useRef(true);
  const { data: session } = useSession();
  const xId = session?.user.twitterId || "";

  //States
  const [threadId, setThreadId] = useState<string>(id || "");
  const [messages, setMessages] = useState<IStep[]>([]);

  //Queries
  const { data: models } = useGetModelQuery(partnerId, xId);
  const { histories, isLoadingHistories } = useGetHistoryQuery(id || "", xId);

  //Mutations
  const { mutateAsync: createThread, isPending: isCreatingThread } =
    useCreateThreadMutation();
  const { mutateAsync: createTask, isPending: isCreatingTask } =
    useCreateTaskMutation();

  //Effect
  useEffect(() => {
    if (histories) {
      const results: IStep[] = [];
      histories.reverse().forEach((history) => {
        const ask: IStep = {
          type: "user_message",
          output: history.text,
          id: uuidv4(),
          name: "",
          createdAt: "",
        };
        const answer: IStep = {
          type: "assistant_message",
          output: history.result,
          id: history._id,
          name: "",
          createdAt: "",
        };
        results.push(ask, answer);
      });
      setMessages(results);
    }
  }, [histories]);

  //Action

  /**
   *
   * @param message
   * @param modelId
   *
   * 1. check threadId. if is empty => create thread
   * 2. create task
   * 3. send message to task
   */
  const handleSubmit = async (message: string, modelId?: string | number) => {
    let tempMessage = [...messages];
    tempMessage.push({
      type: "user_message",
      output: message,
      id: uuidv4(),
      name: "",
      createdAt: "",
    });
    setMessages(tempMessage);

    //add loading
    tempMessage.push({
      type: "assistant_message",
      id: "loading",
      name: "",
      createdAt: "",
      output: "",
    });

    autoScrollRef.current = true;
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const threadModel: ThreadModel = {
        agent_name: argentName,
        x_id: xId,
      };
      const thread = await createThread(threadModel);
      setThreadId(thread.thread_id);
      currentThreadId = thread.thread_id;
    }

    setMessages(tempMessage);

    const taskModel: TaskModel = {
      thread_id: currentThreadId,
      text: message,
      x_id: xId,
      args: {
        model: modelId?.toString() || "",
      },
    };

    const task = await createTask(taskModel);

    //remove loading
    tempMessage = tempMessage.filter((message) => message.id !== "loading");
    tempMessage.push({
      type: "assistant_message",
      output: task.result,
      id: uuidv4(),
      name: "",
      createdAt: "",
    });
    setMessages(tempMessage);
  };

  //Rendering
  const modelsDropdown: DropdownItemProps[] = useMemo(() => {
    return (
      models?.map((model) => ({
        label: model.title,
        value: model.name,
      })) || []
    );
  }, [models]);

  const isSubmitting = useMemo(() => {
    return isCreatingThread || isCreatingTask;
  }, [isCreatingThread, isCreatingTask]);

  return (
    <div className="flex flex-col w-full h-full">
      <ScrollContainer
        autoScrollUserMessage={true}
        autoScrollRef={autoScrollRef}
        messages={messages}
        className="flex-1"
      >
        <div className="flex flex-col mx-auto w-full h-full">
          {!isLoadingHistories ? (
            <MessagesContainer messages={messages} />
          ) : (
            <div className="flex flex-col mx-auto w-full h-full justify-center items-center">
              <Loader className="w-10 h-10 text-rivalz-text-primary" />
            </div>
          )}
        </div>
      </ScrollContainer>
      <div className="flex flex-col mx-auto w-full mb-10 pt-0">
        <ChatFooter
          autoScrollRef={autoScrollRef}
          models={modelsDropdown}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default Chat;
