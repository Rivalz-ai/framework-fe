import _ from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Loader } from "@/components/customs/loader";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Kbd } from "@/components/customs/kbd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Typography from "@/components/customs/typography";
import Tag from "@/components/customs/tag";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useGetThreads } from "@/hooks/apis/chatbot/threads";
import { IThread } from "@/types/thread-type";

interface Props {
  isCollapsed: boolean;
}
export default function SearchChats({ isCollapsed }: Props) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [threads, setThreads] = useState<IThread[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //const apiClient = useContext(ChainlitContext);
  //const { listThreads } = useGetThreads();
  const { getThreadsAsync, isGettingThreads } = useGetThreads();
  const { isAuthenticated } = useAuth();
  // const { threadId } = useChatMessages();
  // const { refetchListTasks } = useGetTasks("rx", threadId ?? "");
  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      _.debounce(async (query: string) => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
          const data = await getThreadsAsync({
            first: 20,
            cursor: undefined,
            search: query || undefined,
          });
          setThreads(data.data || []);
        } catch (error) {
          toast.error("Error fetching threads: " + error);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  // Group threads by month and year
  const groupedThreads = useMemo(() => {
    return _.groupBy(threads, (thread) => {
      const date = new Date(thread.createdAt);
      return `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;
    });
  }, [threads]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              //disabled={true}
              id="search-chats-button"
              onClick={() => setOpen(!open)}
              size="default"
              variant="outline"
              className={cn(
                "text-muted-foreground hover:text-muted-foreground w-full",
                isCollapsed && "w-11 h-11 p-0 items-center justify-center"
              )}
            >
              {isCollapsed ? (
                <Image
                  src={"/icons/search.svg"}
                  alt="Search"
                  width={20}
                  height={20}
                />
              ) : (
                <div className="w-full flex flex-row justify-between">
                  <div className="flex flex-row gap-2">
                    <Image
                      src={"/icons/search.svg"}
                      alt="Search"
                      width={16}
                      height={16}
                    />
                    <Typography.Text variant="s-regular">
                      Search ...
                    </Typography.Text>
                  </div>
                  <Tag text={"⌘K"} />
                </div>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col items-center">
              search
              <Kbd>Cmd+k</Kbd>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">
          Search conversation history
        </DialogTitle>
        <CommandInput
          placeholder="Enter a name of a conversation"
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList className="h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#373A40] scrollbar-track-transparent">
          {loading ? (
            <CommandEmpty className="p-4 flex items-center justify-center">
              <Loader />
            </CommandEmpty>
          ) : Object.keys(groupedThreads).length === 0 ? (
            <CommandEmpty>empty</CommandEmpty>
          ) : (
            Object.entries(groupedThreads).map(([monthYear, monthThreads]) => (
              <CommandGroup
                key={`${searchQuery}-${monthYear}`}
                heading={monthYear}
              >
                {monthThreads.map((thread) => (
                  <CommandItem
                    className="cursor-pointer"
                    key={`${searchQuery}-${thread.id}`}
                    value={`${searchQuery}-${thread.id}`}
                    onSelect={() => {
                      setOpen(false);
                      // refetchListTasks();
                      router.push(`/thread/${thread.id}`);
                    }}
                  >
                    <div className="line-clamp-2">
                      {thread.name || "Untitled Conversation"}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
