"use client";
import React from "react";
import Chat, { ChatProps } from "../component/chat";

export default function PartnerChatContainer(chatProps: ChatProps) {
  return (
    <div className="flex flex-1 h-screen  w-full ">
      <Chat {...chatProps} />
    </div>
  );
}
