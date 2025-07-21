/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Typography from "@/components/customs/typography";
import ArgentHistory from "./argent-history";
import { cn } from "@/lib/utils";

let _scrollTop = 0;

interface Props {
  isOwnerSwarm?: boolean;
  onTogglePartnerSearch: () => void;
}
export function ThreadHistory({ isOwnerSwarm, onTogglePartnerSearch }: Props) {
  const [selectedHistory, setSelectedHistory] = useState<"argent" | "partner">(
    "argent"
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  //const [{ swarmSelected }] = useGlobalStore();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = _scrollTop;
    }
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
    _scrollTop = scrollTop;
  };

  return (
    <>
      <SidebarContent onScroll={handleScroll} ref={scrollRef}>
        <SidebarGroup>
          <SidebarMenu>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between items-center gap-1">
                <div
                  onClick={() => setSelectedHistory("argent")}
                  className={cn(
                    "flex flex-1 justify-center items-center border  bg-[#23262E] border-rivalz-border-primary rounded-md py-1 cursor-pointer",
                    selectedHistory === "argent" && "bg-rivalz-bg-primary",
                    !isOwnerSwarm && "hidden"
                  )}
                >
                  <Typography.Text
                    className={cn(
                      "text-[#999999]",
                      selectedHistory === "argent" && "text-white"
                    )}
                  >
                    Agent
                  </Typography.Text>
                </div>
                <div
                  onClick={onTogglePartnerSearch}
                  className={cn(
                    "flex flex-1 justify-center items-center border bg-[#23262E] border-rivalz-border-primary rounded-md py-1 cursor-pointer",
                    selectedHistory === "partner" && "bg-rivalz-bg-primary"
                  )}
                >
                  <Typography.Text
                    className={cn(
                      "text-[#999999]",
                      selectedHistory === "partner" && "text-white"
                    )}
                  >
                    Partner
                  </Typography.Text>
                </div>
              </div>
              {selectedHistory === "argent" && isOwnerSwarm && (
                <ArgentHistory scrollRef={scrollRef} />
              )}
            </div>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
