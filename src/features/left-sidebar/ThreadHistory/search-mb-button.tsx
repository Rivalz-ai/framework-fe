import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  onToggle: () => void;
}

export default function SearchMbButton({ onToggle }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onToggle}
            id="search-chats-button"
            size="default"
            variant="outline"
            className={cn(
              "text-muted-foreground hover:text-muted-foreground relative w-11 h-11 p-0 items-center justify-center"
            )}
          >
            <Image
              src={"/icons/search.svg"}
              alt="Search"
              width={20}
              height={20}
            />
            <span className="absolute top-0 right-1">P</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col items-center">
            search partner conversations
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
