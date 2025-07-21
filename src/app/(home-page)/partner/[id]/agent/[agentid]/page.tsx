"use client";
import { PartnerChatContainer } from "@/features/partner/container";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import React from "react";

interface PartnerPageProps {
  params: {
    id: string;
    agentid: string;
  };
}

export default async function PartnerPage({ params }: PartnerPageProps) {
  const { id, agentid } = params;
  const router = useRouter();
  const { isUnauthenticated } = useAuth();
  if (isUnauthenticated) {
    router.push("/");
  }
  return <PartnerChatContainer partnerId={id} argentName={agentid} id={""} />;
}
