"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetPartner } from "@/features/partner/hooks/api/query";
import { useSession } from "next-auth/react";
import React from "react";
import Image from "next/image";
import Typography from "@/components/customs/typography";
import { IAgent, IPartner } from "@/types/partner-type";
import { useRouter } from "next/navigation";

interface Props {
  isAuthenticated: boolean;
  isCollapsed: boolean;
}
export default function PartnerSubmenu({
  isAuthenticated,
  isCollapsed,
}: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const twitterId = session?.user.twitterId || "";
  const { partners } = useGetPartner(twitterId);

  const onNavigate = (agent: IAgent, partner: IPartner) => {
    router.push(`/partner/${partner._id}/agent/${agent.name}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={!isAuthenticated}
          className="w-11 h-11 p-0 lg:w-full"
          variant={"outline"}
          title="Partner"
        >
          <span className="text-lg text-white">
            {isCollapsed ? "P" : "Partner"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right">
        <DropdownMenuGroup>
          {partners?.map((partner) => (
            <DropdownMenuSub key={partner._id}>
              <DropdownMenuSubTrigger className="flex items-center gap-4 py-2">
                <Image
                  src={partner.logo || "/mock-avatar.png"}
                  alt={partner.name}
                  width={24}
                  height={24}
                  className="rounded-full size-6"
                />
                <Typography.Text variant="m-medium" className="text-[#DFE1E3]">
                  {partner.name}
                </Typography.Text>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="ml-2">
                  {partner.agents.map((agent) => (
                    <DropdownMenuItem
                      key={agent.name}
                      onClick={() => onNavigate(agent, partner)}
                    >
                      <Typography.Text
                        variant="m-regular"
                        className="text-[#DFE1E3]"
                      >
                        {agent.title}
                      </Typography.Text>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
