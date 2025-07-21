"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
export function SendMessage() {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Handle send message logic here
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col border border-rivalz-border-secondary">
      <div className="flex py-4">
        <Textarea
          className="border-none"
          placeholder="Type your message here..."
        />
      </div>
      <div className="flex flex-row justify-between">
        {/* <Button variant={"outline"}>
          <Image
            src={"/icons/attach-gray.svg"}
            alt={"attach-file"}
            width={20}
            height={20}
          />
        </Button> */}
        <Button variant={"default"}>
          <Image
            src={"/icons/send-gray.svg"}
            alt={"send-message"}
            width={20}
            height={20}
          />
        </Button>
      </div>
    </Card>
  );
}
