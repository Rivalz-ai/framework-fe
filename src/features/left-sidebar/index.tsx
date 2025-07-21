//import { useNavigate } from 'react-router-dom';

import { Sidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import SearchChats from "./Search";
import { ThreadHistory } from "./ThreadHistory";
import NewChatButton from "./NewChat";
import { useAuth } from "@/hooks/use-auth";
import DropdownIconCustom from "@/components/customs/dropdown-icon-custom";
import DropdownWithoutHeader from "@/components/customs/dropdown-icon-without-header";
import Typography from "@/components/customs/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetListSwarms } from "@/hooks/apis/swarms";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/stores";
import { ISwarm } from "@/types/swarms-type";
import { useSession, signOut } from "next-auth/react";
import { useState, useMemo } from "react";
import Image from "next/image";
import { useSetRecoilState } from "recoil";
import { PartnerSubmenu } from "./sub-menu";
import SearchMbButton from "./ThreadHistory/search-mb-button";
import PartnerSearchChats from "./ThreadHistory/partner-search";
import { useGetThreads } from "@/hooks/apis/chatbot/threads";

export default function LeftSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSwarmMenuOpen, setIsSwarmMenuOpen] = useState(false);
  const [listSwarms, setListSwarms] = useState<ISwarm[]>([]);
  const { mutateAsync } = useGetListSwarms();
  const { data: session } = useSession();
  const [{ swarmSelected }, setGlobalState] = useGlobalStore();

  const [isPartnerSearchOpen, setIsPartnerSearchOpen] = useState(false);

  useMemo(async () => {
    if (session?.user.twitterId) {
      setListSwarms(await mutateAsync(session?.user.twitterId));
    }
  }, [isAuthenticated]);
  return (
    <Sidebar {...props} className="border-none">
      <div className={cn("flex flex-row flex-1")}>
        <Card
          className={cn(
            "flex flex-col  transition-all duration-300 rounded-none",
            isCollapsed ? "w-[76px] items-center bg-transparent " : "w-[308px]",
            isSwarmMenuOpen ? "mr-4" : ""
          )}
        >
          <div className="flex flex-col flex-1 gap-6">
            <div className="flex flex-col gap-3">
              <div
                className={cn(
                  "flex flex-row gap-2",
                  isCollapsed ? "flex-col" : ""
                )}
              >
                <Button
                  disabled={!isAuthenticated}
                  className="w-11 h-11 p-0"
                  variant={"outline"}
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  <Image
                    className={cn(!isAuthenticated && "filter grayscale")}
                    src="/icons/sidebar.svg"
                    alt="menu"
                    width={24}
                    height={24}
                  />
                </Button>
                {isCollapsed && listSwarms.length > 0 && (
                  <>
                    <Button
                      disabled={!isAuthenticated}
                      className="w-11 h-11 p-0"
                      variant={"outline"}
                      onClick={() => setIsSwarmMenuOpen(!isSwarmMenuOpen)}
                    >
                      <Image
                        className={cn(!isAuthenticated && "filter grayscale")}
                        src={swarmSelected.logo ?? "/mock-avatar.png"}
                        alt="menu"
                        width={24}
                        height={24}
                      />
                    </Button>
                  </>
                )}

                {!isCollapsed && listSwarms.length > 0 && (
                  <div className="flex-1">
                    <DropdownIconCustom
                      label="Select Swarm"
                      items={listSwarms.map((item) => ({
                        label: item.project_name,
                        value: item.project_id,
                        iconSrc: item.logo,
                      }))}
                      selectedValue={swarmSelected.project_id}
                      onSelect={(value) => {
                        const findSwarm = listSwarms.find(
                          (item) => item.project_id === value
                        );

                        setGlobalState({
                          swarmSelected: {
                            project_id: findSwarm?.project_id ?? "",
                            project_name: findSwarm?.project_name ?? "",
                            status: findSwarm?.status ?? "",
                            unique_name: findSwarm?.unique_name ?? "",
                            logo: findSwarm?.logo ?? "/mock-avatar.png",
                          },
                        });
                        //setIdToResume(undefined);
                        // setCurrentThreadId(undefined);
                        router.push("/");
                      }}
                      menuContentClassName={cn(
                        "rounded-[20px] min-w-[200px] bg-[#13161B] px-2 py-3"
                      )}
                    />
                  </div>
                )}
              </div>
              <PartnerSubmenu
                isAuthenticated={isAuthenticated}
                isCollapsed={isCollapsed}
              />

              {listSwarms.length > 0 && (
                <SearchChats isCollapsed={isCollapsed} />
              )}
              {isCollapsed && (
                <SearchMbButton
                  onToggle={() => setIsPartnerSearchOpen(!isPartnerSearchOpen)}
                />
              )}
              {listSwarms.length > 0 && (
                <NewChatButton
                  navigate={(to: string) => router.push(to)}
                  isCollapsed={isCollapsed}
                  isAuthenticated={isAuthenticated}
                />
              )}
              <Button
                variant={"outline"}
                className={cn(
                  "w-full transition-transform duration-300 ease-in-out",
                  isCollapsed ? "w-11 h-11 p-0" : ""
                )}
                onClick={() => signOut()}
              >
                <Image
                  src="/icons/sign-out-white.svg"
                  alt="sign-out"
                  width={20}
                  height={20}
                />
                {!isCollapsed && (
                  <Typography.Text
                    variant="m-bold"
                    className="text-rivalz-text-primary"
                  >
                    SignOut
                  </Typography.Text>
                )}
              </Button>
            </div>

            <div
              className="flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#373A40] scrollbar-track-transparent"
              style={{ maxHeight: `calc(100vh - 350px)` }}
            >
              {!isCollapsed && (
                <ThreadHistory
                  isOwnerSwarm={listSwarms.length > 0}
                  onTogglePartnerSearch={() =>
                    setIsPartnerSearchOpen(!isPartnerSearchOpen)
                  }
                />
              )}
            </div>
          </div>

          <div
            className={cn(
              "flex flex-row gap-2 ",
              isCollapsed ? "flex-col-reverse justify-center items-center " : ""
            )}
          >
            <Button
              variant={"outline"}
              className={cn("w-full gap-2", isCollapsed ? "w-11 h-11 p-0" : "")}
            >
              {!isCollapsed && (
                <Typography.Text variant="m-bold">Readme</Typography.Text>
              )}
              <Image
                src="/icons/document-gray.svg"
                alt="readme"
                width={20}
                height={20}
              />
            </Button>
          </div>
        </Card>

        {isCollapsed && isSwarmMenuOpen && (
          <DropdownWithoutHeader
            items={listSwarms.map((item) => ({
              label: item.project_name,
              value: item.project_id,
              iconSrc: item.logo,
            }))}
            selectedValue={swarmSelected.project_id}
            onSelect={(value) => {
              const findSwarm = listSwarms.find(
                (item) => item.project_id === value
              );
              setGlobalState({
                swarmSelected: {
                  project_id: findSwarm?.project_id ?? "",
                  project_name: findSwarm?.project_name ?? "",
                  status: findSwarm?.status ?? "",
                  unique_name: findSwarm?.unique_name ?? "",
                  logo: findSwarm?.logo ?? "/mock-avatar.png",
                },
              });
              setIsSwarmMenuOpen(false);
              router.push("/");
            }}
            menuContentClassName={cn(
              "rounded-[20px] min-w-[200px] bg-[#13161B] px-2 py-3"
            )}
          />
        )}
      </div>

      <PartnerSearchChats
        isOpen={isPartnerSearchOpen}
        onToggle={setIsPartnerSearchOpen}
      />
    </Sidebar>
  );
}
