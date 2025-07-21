import React, { useEffect } from "react";
import { IStep } from "@/types/step-type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader } from "@/components/customs/loader";
import { useSendFeedbacks } from "@/hooks/apis/chatbot/chat";
import UserMessage from "../message/user-message";
import { MessageContent } from "../message/content";
import Step from "./step";

interface Props {
  message: IStep;
}

export default function Message({ message }: Props) {
  const isUserMessage = message.type === "user_message";
  const isChatbotMessage = message.type === "assistant_message";
  const isLoading = message.id === "loading";
  const isStep = !message.type.includes("message");
  const isShowAction = isChatbotMessage && !isLoading;

  const { sendFeedbacksAsync, isSendingFeedbacks } = useSendFeedbacks();

  const onCopy = () => {
    navigator.clipboard.writeText(message.output);
    toast.success("Copied to clipboard");
  };

  const onLike = async (stepID: string) => {
    try {
      await sendFeedbacksAsync({
        forId: stepID,
        value: 1,
        comment: "",
      });
      toast.success("You liked this message");
    } catch (error: any) {
      toast.error(error.message || "Something wrong");
    }
  };

  const onDislike = async (stepID: string) => {
    try {
      await sendFeedbacksAsync({
        forId: stepID,
        value: -1,
        comment: "",
      });
      toast.success("You disliked this message");
    } catch (error: any) {
      toast.error(error.message || "Something wrong");
    }
  };

  return (
    <div className={cn("flex", isUserMessage && "justify-end")}>
      <div
        className={cn(
          "px-4 py-3 rounded-[20px] w-fit text-base text-[#fafafa] flex gap-5 items-start",
          isUserMessage && "bg-[#23262E] items-end max-w-[512px]"
        )}
      >
        <div className="flex flex-col gap-2">
          {/* <div className="text-base text-[#fafafa]">{message.output}</div> */}
          {!isLoading && isUserMessage ? (
            <div className="text-base text-[#fafafa]">{message.output}</div>
          ) : (
            <div className="ai-message flex gap-4 w-full">
              {/* {!isStep || !indent ? (
                <MessageAvatar
                  author={message.metadata?.avatarName || message.name}
                  isError={message.isError}
                />
              ) : null} */}
              {isChatbotMessage && (
                <Image
                  src="/icons/rx.svg"
                  width={100}
                  height={100}
                  alt="rx"
                  className="size-6"
                />
              )}
              {isStep ? (
                <Step step={message} isRunning={false}>
                  <MessageContent
                    message={message}
                    allowHtml={true}
                    latex={true}
                  />
                </Step>
              ) : (
                <div className="flex flex-col items-start min-w-[150px] flex-grow gap-2">
                  <MessageContent
                    message={message}
                    allowHtml={true}
                    latex={true}
                  />
                </div>
              )}
            </div>
          )}
          {isLoading && (
            <div className="text-base text-[#fafafa]">
              <Loader className="w-6 h-6" />
            </div>
          )}
          {isShowAction && (
            <div className="flex gap-1">
              <motion.button
                className="flex items-center size-9 cursor-pointer"
                whileTap={{ scale: 0.9 }}
                onClick={onCopy}
              >
                <Image
                  src="/icons/copy.svg"
                  width={100}
                  height={100}
                  alt="copy"
                  className="size-5"
                />
              </motion.button>

              <motion.button
                className="flex items-center size-9 cursor-pointer"
                whileTap={{ scale: 0.9 }}
                onClick={() => onLike(message.id)}
                disabled={isSendingFeedbacks}
              >
                <Image
                  src="/icons/like.svg"
                  width={100}
                  height={100}
                  alt="like"
                  className="size-5"
                />
              </motion.button>

              <motion.button
                className="flex items-center size-9 cursor-pointer"
                whileTap={{ scale: 0.9 }}
                onClick={() => onDislike(message.id)}
                disabled={isSendingFeedbacks}
              >
                <Image
                  src="/icons/dislike.svg"
                  width={100}
                  height={100}
                  alt="dislike"
                  className="size-5"
                />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
