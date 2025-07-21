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
import { IAgent } from "@/types/partner-type";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ChoosePartnerProps {
  onSelect: (agent: IAgent) => void;
}

export function ChoosePartner({ onSelect }: ChoosePartnerProps) {
  const [, setAgentName] = useState("");
  const [agentTitle, setAgentTitle] = useState("");
  const { data: session } = useSession();
  const twitterId = session?.user.twitterId || "";
  const { partners } = useGetPartner(twitterId);

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSelect = (agent: IAgent) => {
    console.log("handleSelect", agent);
    setAgentName(agent.name);
    setAgentTitle(agent.title);
    onSelect(agent);
  };

  useEffect(() => {
    if (partners && partners.length > 0) {
      handleSelect(partners[0].agents[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partners]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="text-xs text-gray-400">{agentTitle || "..."}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {partners?.map((partner) => (
            <DropdownMenuSub key={partner._id}>
              <DropdownMenuSubTrigger>{partner.name}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {partner.agents.map((agent) => (
                    <DropdownMenuItem
                      key={agent.name}
                      onClick={() => handleSelect(agent)}
                    >
                      {agent.title}
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
