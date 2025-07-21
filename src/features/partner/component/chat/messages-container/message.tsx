import React from "react";
import { IStep } from "@/types/step-type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader } from "@/components/customs/loader";
interface Props {
  message: IStep;
}

export default function Message({ message }: Props) {
  const isUserMessage = message.type === "user_message";
  const isPartnerMessage = message.type === "assistant_message";
  const isLoading = message.id === "loading";

  const isShowAction = isPartnerMessage && !isLoading;

  const onCopy = () => {
    navigator.clipboard.writeText(message.output);
    toast.success("Copied to clipboard");
  };

  const onLike = () => {
    toast.success("You liked this message");
  };

  const onDislike = () => {
    toast.success("You disliked this message");
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
          {!isLoading && (
            <div className="text-base text-[#fafafa]">{message.output}</div>
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
                onClick={onLike}
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
                onClick={onDislike}
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
