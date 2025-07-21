import { cn } from "@/lib/utils";
import { size } from "lodash";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import Alert from "@/components/customs/alert";
import { Loader } from "@/components/customs/loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ThreadOptions from "./ThreadOptions";
import Link from "next/link";
import { useGlobalStore } from "@/stores";
import { useRouter } from "next/navigation";
import { IListThreadsResponse, IThread } from "@/types/thread-type";
import {
  useDeleteThread,
  useUpdateThreadInfo,
} from "@/hooks/apis/chatbot/threads";

interface ThreadListProps {
  //threadHistory?: ThreadHistory;
  threadHistory?: IThread[];
  listThreads?: IListThreadsResponse;
  error?: string;
  isFetching: boolean;
  isLoadingMore: boolean;
  onThreadHistoryChange: (threadHistory: IListThreadsResponse) => void;
}

export function ThreadList({
  threadHistory,
  listThreads,
  error,
  isFetching,
  isLoadingMore,
  onThreadHistoryChange,
}: ThreadListProps) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isRenameLoading, setIsRenameLoading] = useState(false);
  const [threadIdToDelete, setThreadIdToDelete] = useState<string>();
  const [threadIdToRename, setThreadIdToRename] = useState<string>();
  const [threadNewName, setThreadNewName] = useState<string>();
  const [{ swarmSelected }] = useGlobalStore();
  const { updateThreadInfoAsync, isUpdatingThreadInfoError } =
    useUpdateThreadInfo();
  const { deleteThreadAsync } = useDeleteThread();

  const sortedTimeGroupKeys = useMemo(() => {
    const groups: Record<string, IThread[]> = {
      Today: [],
      Yesterday: [],
      "Previous 7 days": [],
      "Previous 30 days": [],
    };
    if (!threadHistory) return groups;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const previous7Days = new Date(today);
    previous7Days.setDate(previous7Days.getDate() - 7);

    const previous30Days = new Date(today);
    previous30Days.setDate(previous30Days.getDate() - 30);

    // Group threads by date ranges

    threadHistory.forEach((thread) => {
      const threadDate = new Date(thread.createdAt);
      threadDate.setHours(0, 0, 0, 0);

      if (threadDate.getTime() === today.getTime()) {
        groups["Today"].push(thread);
      } else if (threadDate.getTime() === yesterday.getTime()) {
        groups["Yesterday"].push(thread);
      } else if (threadDate >= previous7Days) {
        groups["Previous 7 days"].push(thread);
      } else if (threadDate >= previous30Days) {
        groups["Previous 30 days"].push(thread);
      }
    });

    // Return sorted group keys that have threads
    return Object.keys(groups).filter((key) => groups[key].length > 0);
  }, [threadHistory, swarmSelected]);

  if (isFetching || (!threadHistory && isLoadingMore)) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" className="m-3">
        {error}
      </Alert>
    );
  }

  if (!threadHistory || size(threadHistory) === 0) {
    return (
      <Alert variant="info" className="m-3">
        empty
      </Alert>
    );
  }

  const handleDeleteThread = async () => {
    if (!threadIdToDelete) return;
    setIsDeleteLoading(true);
    try {
      await deleteThreadAsync(threadIdToDelete);
      setThreadIdToDelete(undefined);
      //refetchListThreads();

      toast.success("Success");
    } catch (error) {
      toast.success("Error");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleRenameThread = async () => {
    if (!threadIdToRename || !threadNewName) return;
    setIsRenameLoading(true);
    try {
      await updateThreadInfoAsync({
        tags: [],
        metadata: {},
        thread_id: threadIdToRename,
        name: threadNewName,
      });
      //await apiClient.renameThread(threadIdToRename, threadNewName);
      setThreadNewName(undefined);
      setThreadIdToRename(undefined);
      //refetchListThreads();
      toast.success("Success");
    } catch (error) {
      console.log(error);
      toast.success("Error");
    } finally {
      setIsRenameLoading(false);
    }
  };

  const getTimeGroupLabel = (group: string) => {
    const labels = {
      Today: "Today",
      Yesterday: "Yesterday",
      "Previous 7 days": "Previous 7 days",
      "Previous 30 days": "Previous 30 days",
    };
    return labels[group as keyof typeof labels] || group;
  };

  return (
    <>
      <Dialog
        open={!!threadIdToDelete}
        onOpenChange={() => setThreadIdToDelete(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setThreadIdToDelete(undefined)}
            >
              Cancel
            </Button>
            <Button
              disabled={isDeleteLoading}
              isLoading={isDeleteLoading}
              type="button"
              onClick={handleDeleteThread}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!threadIdToRename}
        onOpenChange={() => setThreadIdToRename(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription>Please enter a new name.</DialogDescription>
          </DialogHeader>
          <div className="my-6">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              required
              value={threadNewName}
              onChange={(e) => setThreadNewName(e.target.value)}
              placeholder="placeholder"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setThreadIdToRename(undefined)}
            >
              Cancel
            </Button>
            <Button
              disabled={isRenameLoading}
              isLoading={isRenameLoading}
              type="button"
              onClick={handleRenameThread}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <TooltipProvider delayDuration={300}>
        {Object.entries(sortedTimeGroupKeys).map(([_, group]) => {
          const items = threadHistory?.filter((thread) => {
            const threadDate = new Date(thread.createdAt);
            threadDate.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const previous7Days = new Date(today);
            previous7Days.setDate(previous7Days.getDate() - 7);

            const previous30Days = new Date(today);
            previous30Days.setDate(previous30Days.getDate() - 30);

            switch (group) {
              case "Today":
                return threadDate.getTime() === today.getTime();
              case "Yesterday":
                return threadDate.getTime() === yesterday.getTime();
              case "Previous 7 days":
                return threadDate >= previous7Days && threadDate < yesterday;
              case "Previous 30 days":
                return (
                  threadDate >= previous30Days && threadDate < previous7Days
                );
              default:
                return false;
            }
          });

          return (
            <SidebarGroup key={group}>
              <SidebarGroupLabel>{getTimeGroupLabel(group)}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items?.map((thread) => {
                    // const isResumed =
                    //   idToResume === thread.id && !currentThreadId;
                    // const isSelected =
                    //   isResumed || currentThreadId === thread.id;
                    const isSelected = false;
                    return (
                      <SidebarMenuItem
                        key={thread.id}
                        id={`thread-${thread.id}`}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/thread/${thread.id}`}>
                              <SidebarMenuButton
                                isActive={isSelected}
                                className={cn(
                                  "relative truncate h-9 group/thread hover:bg-[#23262E]",
                                  isSelected && "bg-[#23262E] text-white"
                                )}
                              >
                                {thread.name && thread.name.length > 25
                                  ? `${thread.name.slice(0, 25)}...`
                                  : thread.name || "untitled"}
                                <div
                                  className={cn(
                                    "absolute w-10 bottom-0 top-0 right-0 bg-gradient-to-l from-[hsl(var(--sidebar-background))] to-transparent"
                                  )}
                                />
                                <ThreadOptions
                                  onDelete={() => {
                                    setThreadIdToDelete(thread.id);
                                  }}
                                  onRename={() => {
                                    setThreadIdToRename(thread.id);
                                    setThreadNewName(thread.name);
                                  }}
                                  className={cn(
                                    "absolute z-20 bottom-0 top-0 right-0 bg-sidebar-accent hover:bg-sidebar-accent hover:text-primary flex opacity-0 group-hover/thread:opacity-100",
                                    isSelected &&
                                      "bg-sidebar-accent opacity-100"
                                  )}
                                />
                              </SidebarMenuButton>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="center">
                            <p>{thread.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </TooltipProvider>
      {isLoadingMore ? (
        <div className="flex items-center justify-center p-2">
          <Loader />
        </div>
      ) : null}
    </>
  );
}
