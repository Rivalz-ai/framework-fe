import {
  useChatData,
  useChatInteract,
  useChatMessages,
} from "@chainlit/react-client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Send } from "lucide-react";
import { Stop } from "../../stop";
import Image from "next/image";

interface SubmitButtonProps {
  disabled?: boolean;
  onSubmit: () => void;
}

export default function SubmitButton({
  disabled,
  onSubmit,
}: SubmitButtonProps) {
  const { loading } = useChatData();
  const { firstInteraction } = useChatMessages();
  const { stopTask } = useChatInteract();

  return (
    <TooltipProvider>
      {loading && firstInteraction ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="stop-button"
              onClick={stopTask}
              size="icon"
              className="rounded-full h-11 w-11 p-0"
            >
              <Stop className="!size-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Stop</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="chat-submit"
              disabled={disabled}
              onClick={onSubmit}
              size="icon"
              className="h-11 w-11 p-0"
            >
              <Image
                src={"/icons/send-gray.svg"}
                alt="Send"
                width={20}
                height={20}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send</p>
          </TooltipContent>
        </Tooltip>
      )}
    </TooltipProvider>
  );
}
