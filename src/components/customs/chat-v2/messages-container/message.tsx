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
interface Props {
  message: IStep;
}

export default function Message({ message }: Props) {
  const isUserMessage = message.type === "user_message";
  const isPartnerMessage = message.type === "assistant_message";
  const isLoading = message.id === "loading";

  const isShowAction = isPartnerMessage && !isLoading;

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
    } catch (error) {}
  };

  const onDislike = async (stepID: string) => {
    try {
      await sendFeedbacksAsync({
        forId: stepID,
        value: -1,
        comment: "",
      });
      toast.success("You disliked this message");
    } catch (error) {}
  };

  return (
    <div className={cn("flex", isUserMessage && "justify-end")}>
      <div
        className={cn(
          "px-4 py-3 rounded-[20px] w-fit text-base text-[#fafafa] flex gap-5 items-start",
          isUserMessage && "bg-[#23262E] items-end max-w-[512px]"
        )}
      >
        {isPartnerMessage && (
          <Image
            src="/icons/rx.svg"
            width={100}
            height={100}
            alt="rx"
            className="size-6"
          />
        )}
        <div className="flex flex-col gap-2">
          {/* <div className="text-base text-[#fafafa]">{message.output}</div> */}
          {!isLoading && isUserMessage ? (
            <div className="flex flex-col flex-grow max-w-full ">
              <UserMessage message={message}>
                <MessageContent
                  // elements={[]}
                  message={message}
                  allowHtml={true}
                  latex={false}
                />
              </UserMessage>
            </div>
          ) : (
            <div className="text-base text-[#fafafa]">{message.output}</div>
            // <div className="ai-message flex gap-4 w-full">
            //   {!isStep || !indent ? (
            //     <MessageAvatar
            //       author={message.metadata?.avatarName || message.name}
            //       isError={message.isError}
            //     />
            //   ) : null}
            //   {/* Display the step and its children */}
            //   {isStep ? (
            //     <Step step={message} isRunning={isRunning}>
            //       {message.steps ? (
            //         <Messages
            //           messages={message.steps.filter(
            //             (s) => !s.type.includes("message")
            //           )}
            //           elements={elements}
            //           actions={actions}
            //           indent={indent + 1}
            //           isRunning={isRunning}
            //         />
            //       ) : null}
            //       <MessageContent
            //         elements={elements}
            //         message={message}
            //         allowHtml={allowHtml}
            //         latex={latex}
            //       />
            //       <MessageButtons message={message} actions={actions} />
            //     </Step>
            //   ) : (
            //     // Display an assistant message
            //     <div className="flex flex-col items-start min-w-[150px] flex-grow gap-2">
            //       <MessageContent
            //         elements={elements}
            //         message={message}
            //         allowHtml={allowHtml}
            //         latex={latex}
            //       />

            //       <AskFileButton messageId={message.id} onError={onError} />
            //       <AskActionButtons
            //         actions={actions}
            //         messageId={message.id}
            //       />

            //       <MessageButtons
            //         message={message}
            //         actions={actions}
            //         run={
            //           scorableRun && isScorable ? scorableRun : undefined
            //         }
            //       />
            //     </div>
            //   )}
            // </div>
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
