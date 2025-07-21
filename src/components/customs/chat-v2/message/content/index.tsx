import { memo } from "react";

import { CURSOR_PLACEHOLDER } from "@/components/customs/blinking-cursor";
import { Markdown } from "@/components/customs/markdown";
import { useEffect, useState } from "react";
import { IStep } from "@/types/step-type";

export interface Props {
  message: IStep;
  allowHtml?: boolean;
  latex?: boolean;
}

const MessageContent = memo(({ message, allowHtml, latex }: Props) => {
  const [displayed, setDisplayed] = useState(0);
  const outputContent =
    message.streaming && message.output ? message.output : message.output;
  useEffect(() => {
    if (message.streaming && message.output) {
      setDisplayed(0);
      let i = 0;
      const totalDuration = 12000;
      const intervalMs = Math.max(
        20,
        totalDuration / (message.output?.length || 1)
      );
      const interval = setInterval(() => {
        i++;
        setDisplayed(i);
        if (i >= message.output.length) clearInterval(interval);
      }, intervalMs);
      return () => clearInterval(interval);
    } else {
      setDisplayed(message.output?.length || 0);
    }
  }, [message.output, message.streaming]);
  const displayInput = message.input && message.showInput;

  const isMessage = message.type.includes("message");

  const outputMarkdown = (
    <>
      {!isMessage && displayInput && message.output ? (
        <div className="font-medium">Output</div>
      ) : null}
      <Markdown allowHtml={allowHtml} latex={latex}>
        {outputContent}
      </Markdown>
    </>
  );

  let inputMarkdown;

  if (displayInput) {
    inputMarkdown = (
      <>
        <div className="font-medium">Input</div>

        <Markdown allowHtml={allowHtml} latex={latex}>
          {message.output}
        </Markdown>
      </>
    );
  }

  const markdownContent = (
    <div className="flex flex-col gap-4">
      {inputMarkdown}
      {outputMarkdown}
    </div>
  );

  return (
    <div className="message-content w-full flex flex-col gap-2">
      {!!inputMarkdown || message.output ? markdownContent : null}
    </div>
  );
});

export { MessageContent };
