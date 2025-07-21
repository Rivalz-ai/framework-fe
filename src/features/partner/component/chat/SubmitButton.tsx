import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

interface SubmitButtonProps {
  disabled?: boolean;
  onSubmit: () => void;
}

export default function SubmitButton({
  disabled,
  onSubmit,
}: SubmitButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={disabled}
            onClick={onSubmit}
            size="icon"
            className="h-11 w-11 p-0 disabled:opacity-50"
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
    </TooltipProvider>
  );
}
