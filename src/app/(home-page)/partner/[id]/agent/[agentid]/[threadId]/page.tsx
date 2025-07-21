import PartnerChatContainer from "@/features/partner/container/partner-chat-container";
import React from "react";

interface PartnerPageProps {
  params: {
    id: string;
    agentid: string;
    threadId: string;
  };
}
export default function AgentPage({ params }: PartnerPageProps) {
  const { id, agentid, threadId } = params;

  return (
    <PartnerChatContainer partnerId={id} argentName={agentid} id={threadId} />
  );
}
