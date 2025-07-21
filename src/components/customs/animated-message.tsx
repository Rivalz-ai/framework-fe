"use client";

import { useEffect, useState, useRef } from "react";
import Typography from "./typography";

type Props = {
  content: string;
};

export function AnimatedMessage({ content }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatText = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => {
        // Handle bold text
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Handle bullet points
        if (line.trim().startsWith("•")) {
          return `<div class="flex gap-2 ml-4">•${line.slice(1)}</div>`;
        }

        return line;
      })
      .join("<br />");
  };

  useEffect(() => {
    if (skipped) {
      setDisplayed(content);
      setDone(true);
      return;
    }

    intervalRef.current = setInterval(() => {
      setDisplayed(content.slice(0, indexRef.current));
      indexRef.current += 1;
      if (indexRef.current > content.length) {
        clearInterval(intervalRef.current!);
        setDone(true);
      }
    }, 20);

    return () => clearInterval(intervalRef.current!);
  }, [content, skipped]);

  const handleClick = () => {
    if (!done) {
      setSkipped(true);
      clearInterval(intervalRef.current!);
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Typography.Text variant="m-regular" className="text-rivalz-text-primary">
        {/* <span dangerouslySetInnerHTML={{ __html: formatText(displayed) }} /> */}
        <span className="whitespace-pre-wrap text-sm text-white">
          {displayed}
        </span>
        {!done && <span className="animate-pulse text-[#69FF93] ml-1">▍</span>}
      </Typography.Text>
    </div>
  );
}
