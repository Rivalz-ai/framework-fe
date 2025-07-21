"use client";

import { Card } from "../ui/card";
import Typography from "./typography";
import Image from "next/image";
import { Button } from "../ui/button";
import Tag from "./tag";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGetTasks } from "@/hooks/apis/tasks";
import { Loader } from "./loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useParams, usePathname } from "next/navigation";
import Alert from "./alert";
import { useGetStatisticAgent } from "@/hooks/apis/agent";
import { formatNumber } from "@/lib/utils";
import { useGlobalStore } from "@/stores";

export function TaskProgress() {
  const { isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const params = useParams();
  const pathname = usePathname();
  const [{ swarmSelected }] = useGlobalStore();
  //if url contains /partner/ then set isPartner to true and return null
  const isPartner = pathname.includes("/partner/");

  const threadIdFromSlug = params?.slug as string;
  //const { threadId } = useChatMessages();
  const { listTasks, isListTasksLoading, isListTasksError, listTasksError } =
    useGetTasks("rx", threadIdFromSlug);
  const { statisticAgent: rxStatisticAgent } = useGetStatisticAgent(
    "rx",
    (swarmSelected && swarmSelected.project_id) ?? ""
  );
  const [progressWidth, setProgressWidth] = useState(0);

  useMemo(async () => {
    if (isAuthenticated && listTasks) {
      const maxWidth = 288; // Maximum width in pixels
      const gap = 4; // Gap between bars in pixels
      const totalGaps =
        listTasks.total_tasks > 0 ? listTasks.total_tasks - 1 : 1;
      const availableWidth = maxWidth - totalGaps * gap;
      setProgressWidth(Math.floor(availableWidth / listTasks.total_tasks));
    }
  }, [isAuthenticated, listTasks, threadIdFromSlug]);
  const summary = [
    {
      title: "Done",
      value: listTasks?.done ?? 0,
      icon: "/icons/check-green.svg",
    },
    {
      title: "Failed",
      value: listTasks?.failed ?? 0,
      icon: "/icons/close-red.svg",
    },
    {
      title: "Pending",
      value: listTasks?.pending ?? 0,
      icon: "/icons/time-gray.svg",
    },
  ];

  if (isPartner) {
    return null;
  }

  return (
    <div className="flex">
      {isCollapsed && (
        <Button
          disabled={!isAuthenticated}
          className="h-11 w-11 p-0 m-6"
          variant={"outline"}
          onClick={() => {
            setIsCollapsed(false);
          }}
        >
          <Image
            src={"/icons/task-done-gray.svg"}
            alt={"task-done"}
            width={20}
            height={20}
          />
        </Button>
      )}
      {!isCollapsed && (
        <Card className="flex flex-col max-w-[368px] rounded-none">
          <div className="flex flex-col flex-1 gap-6">
            <div className="flex flex-row justify-between">
              <Typography.Text variant="m-regular">
                Task Progress
              </Typography.Text>
              <Button
                variant={"noBorder"}
                onClick={() => {
                  setIsCollapsed(true);
                }}
              >
                <Image
                  src={"/icons/close.svg"}
                  alt={"close"}
                  width={20}
                  height={20}
                />
              </Button>
            </div>
            <div className="shadow-md p-4 border border-rivalz-border-secondary rounded-[20px]">
              <div className="flex flex-row gap-2 justify-start items-center">
                <Typography.Text
                  variant="m-regular"
                  className="text-rivalz-text-primary"
                >
                  RX Agents Total:
                </Typography.Text>
                <Typography.Text variant="s-regular">
                  {formatNumber(rxStatisticAgent?.total || 0)}
                </Typography.Text>
              </div>
              <div className="flex flex-row gap-2 justify-start items-center">
                <Typography.Text
                  variant="m-regular"
                  className="text-rivalz-text-primary"
                >
                  RX Agents available this week:
                </Typography.Text>
                <Typography.Text variant="s-regular">
                  {formatNumber(rxStatisticAgent?.available || 0)}
                </Typography.Text>
              </div>
            </div>
            <div className="flex flex-col gap-6 p-4 border border-rivalz-border-secondary rounded-[20px]">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between">
                  <Typography.Text
                    variant="l-regular"
                    className="text-rivalz-text-primary"
                  >
                    RX Post Tasks
                  </Typography.Text>

                  <Tag
                    text={`${listTasks?.done ?? 0}/${listTasks?.total_tasks ?? 0}`}
                    className="text-[#CECFD2] text-[14px] bg-[#0C0E12]"
                  />
                </div>

                {!isListTasksLoading && isListTasksError && (
                  <Alert variant="error" className="m-3">
                    {listTasksError?.message}
                  </Alert>
                )}
                <div className="flex flex-row gap-1 mb-4 w-[288px]">
                  {isListTasksLoading ? (
                    <div className="w-full h-1 bg-[#373A40] rounded-full animate-pulse" />
                  ) : (
                    Array.from({ length: listTasks?.total_tasks ?? 0 }).map(
                      (_, index) => (
                        <div
                          key={index}
                          style={{ width: `${progressWidth}px` }}
                          className={`h-1 rounded-full ${
                            listTasks?.done && index < listTasks?.done
                              ? "bg-[#69FF93]"
                              : "bg-[#373A40]"
                          }`}
                        />
                      )
                    )
                  )}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                {summary.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-2 items-center"
                    >
                      <div className="flex flex-row gap-1">
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={12}
                          height={12}
                        />
                        <Typography.Text variant="xs-medium">
                          {item.title}
                        </Typography.Text>
                      </div>
                      <Typography.Text
                        variant="s-regular"
                        className="text-rivalz-text-primary"
                      >
                        {item.value}
                      </Typography.Text>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-6 mb-6">
              <Typography.Text variant="l-regular">Summary</Typography.Text>
              <div
                className="flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#373A40] scrollbar-track-transparent"
                style={{ maxHeight: `calc(100vh - 500px)` }}
              >
                <Accordion type="multiple" className="w-full">
                  {/* Success Tasks */}
                  <AccordionItem value="success">
                    <AccordionTrigger>
                      ✅ Success Tasks ({listTasks?.list_result_done.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      {listTasks?.list_result_done.length === 0 ? (
                        <p className="text-muted-foreground text-sm pl-4">
                          No success tasks.
                        </p>
                      ) : (
                        listTasks?.list_result_done.map((task) => (
                          <Link
                            href={`https://twitter.com/i/web/status/${task.data}`}
                            key={task.id}
                            target={"_blank"}
                            className="flex flex-row gap-2 justify-start items-start"
                          >
                            <Image
                              className="w-4 h-4 mt-1"
                              src={"/icons/open-new-gray.svg"}
                              alt={"open-new-tab"}
                              width={12}
                              height={12}
                            />
                            <Typography.Text
                              variant="s-regular"
                              className="break-words whitespace-pre-wrap w-full overflow-hidden text-wrap"
                            >
                              The task was posted successfully. You can check it
                              at this link:
                              {` https://twitter.com/i/web/status/${task.data}`}
                            </Typography.Text>
                          </Link>
                        ))
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Failed Tasks */}
                  <AccordionItem value="fail">
                    <AccordionTrigger>
                      ❌ Failed Tasks ({listTasks?.list_failed.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      {listTasks?.list_failed.length === 0 ? (
                        <p className="text-muted-foreground text-sm pl-4">
                          No failed tasks.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {listTasks?.list_failed.map((task) => (
                            <li
                              key={task.id}
                              className="pl-4 text-sm text-white"
                            >
                              <div className="bg-[#23262E] border border-rivalz-badge-border-dark rounded-lg p-4 text-sm  grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                                <div>
                                  <div className="text-xs font-medium text-rivalz-text-tertiary mb-1">
                                    Task ID
                                  </div>
                                  <div className="font-mono break-all">
                                    {task.task_id}
                                  </div>

                                  <div className="text-xs font-medium text-rivalz-text-tertiary mt-3 mb-1">
                                    Twitter ID
                                  </div>
                                  <div className="font-mono break-all">
                                    {task.id}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs font-medium text-rivalz-text-tertiary mb-1">
                                    Error
                                  </div>
                                  <div className="italic whitespace-pre-wrap break-words text-[13px] text-red-500">
                                    {task.error}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        // <ul className="space-y-2">
                        //   {listTasks?.list_failed.map((task) => (
                        //     <li
                        //       key={task.id}
                        //       className="pl-4 text-sm text-red-500"
                        //     >
                        //       <div className="font-medium">{task.name}</div>
                        //       <div className="text-xs text-muted-foreground">
                        //         loop: {task.num_loop}, agent: {task.agent_type}
                        //       </div>
                        //       <div className="text-xs italic text-red-400">
                        //         ❗ {task.error}
                        //       </div>
                        //     </li>
                        //   ))}
                        // </ul>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {/* {listTasks?.list_result_done.map((task) => (
                  <Link
                    href={`https://twitter.com/i/web/status/${task.data}`}
                    key={task.id}
                    target={"_blank"}
                    className="flex flex-row gap-2 justify-start items-start"
                  >
                    <Image
                      className="w-4 h-4 mt-1"
                      src={"/icons/open-new-gray.svg"}
                      alt={"open-new-tab"}
                      width={12}
                      height={12}
                    />
                    <Typography.Text variant="s-regular">
                      {`The task was posted successfully. You can check it at this link:
                      https://twitter.com/i/web/status/${task.data}`}
                    </Typography.Text>
                  </Link>
                ))} */}
                {isListTasksLoading ?? <Loader />}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between rounded-[10px] border border-rivalz-border-secondary p-4">
            <Typography.Text variant="m-regular">Total Tasks:</Typography.Text>
            <Typography.Text variant="m-regular">
              {listTasks?.total_tasks ?? 0}
            </Typography.Text>
          </div>
        </Card>
      )}
    </div>
  );
}
