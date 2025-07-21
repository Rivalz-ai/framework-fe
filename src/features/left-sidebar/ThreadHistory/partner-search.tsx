import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Loader } from "@/components/customs/loader";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { DialogTitle } from "@/components/ui/dialog";

import { ChoosePartner } from "./choose-partner";
import { useGetPartnerThreadQuery } from "@/features/partner/hooks/api/query";
import { useSession } from "next-auth/react";
import Typography from "@/components/customs/typography";
import { IAgent, ThreadPartner } from "@/types/partner-type";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onToggle?: (open: boolean) => void;
}
export default function PartnerSearchChats({ isOpen, onToggle }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const twitterId = session?.user.twitterId || "";

  // const [agentName, setAgentName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [threads, setThreads] = useState<ThreadPartner[]>([]);

  const [agent, setAgent] = useState<IAgent | null>(null);

  const { data, isLoading, isFetching } = useGetPartnerThreadQuery(
    twitterId,
    agent?.name || ""
  );

  useEffect(() => {
    if (data) {
      setThreads(data);
    }
  }, [data]);

  const debouncedSearch = useMemo(
    () =>
      _.debounce(async (query: string) => {
        try {
          const dataFiltered = data?.filter((thread) =>
            thread.title?.toLowerCase().includes(query.toLowerCase())
          );
          setThreads(dataFiltered || []);
        } catch (error: unknown) {
          console.error(error);
        }
      }, 300),
    [data]
  );
  // Group threads by month and year
  const groupedThreads = useMemo(() => {
    return _.groupBy(threads || [], (thread) => {
      const date = new Date(thread.created_at);
      return `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;
    });
  }, [threads]);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const onNavigate = (thread: ThreadPartner) => {
    if (!agent) return;
    router.push(
      `/partner/${agent.partner_id}/agent/${agent.name}/${thread._id}`
    );
  };

  const isProcessing = isLoading || isFetching;

  return (
    <CommandDialog open={isOpen} onOpenChange={onToggle}>
      <DialogTitle className="sr-only">Search conversation history</DialogTitle>
      <div className="flex w-full ">
        <CommandInput
          placeholder="Enter a name of a conversation"
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="w-full border-none"
        />
        <div className="absolute right-10 top-2.5 my-auto cursor-pointer">
          <ChoosePartner
            onSelect={(agent) => {
              setAgent(agent);
            }}
          />
        </div>
      </div>
      <CommandList className="h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#373A40] scrollbar-track-transparent">
        {isProcessing && (
          <CommandEmpty className="p-4 flex items-center justify-center">
            <Loader />
          </CommandEmpty>
        )}
        {!isProcessing && data && data.length < 1 && (
          <CommandEmpty>
            <Typography.Text variant="m-bold">
              No conversations found
            </Typography.Text>
          </CommandEmpty>
        )}

        {Object.entries(groupedThreads).map(([monthYear, monthThreads]) => (
          <CommandGroup key={`${searchQuery}-${monthYear}`} heading={monthYear}>
            {monthThreads.map((thread) => (
              <CommandItem
                className="cursor-pointer"
                key={`${searchQuery}-${thread._id}`}
                value={`${searchQuery}-${thread._id}`}
                onSelect={() => {
                  onToggle?.(false);
                  onNavigate(thread);
                }}
              >
                <div className="line-clamp-2">
                  {thread.title || "Untitled Conversation"}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
