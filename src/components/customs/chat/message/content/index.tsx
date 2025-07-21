import { prepareContent } from "@/lib/message";
import { memo } from "react";

import type { IMessageElement, IStep } from "@chainlit/react-client";
import { CURSOR_PLACEHOLDER } from "@/components/customs/blinking-cursor";
import { Markdown } from "@/components/customs/markdown";
import { InlinedElements } from "./inlined-elements";
import { useEffect, useState } from "react";

export interface Props {
  elements: IMessageElement[];
  message: IStep;
  allowHtml?: boolean;
  latex?: boolean;
}

const MessageContent = memo(
  ({ message, elements, allowHtml, latex }: Props) => {
    const [displayed, setDisplayed] = useState(0);
    const outputContent =
      message.streaming && message.output ? message.output : message.output;
    useEffect(() => {
      if (message.streaming && message.output) {
        setDisplayed(0);
        let i = 0;
        const totalDuration = 12000; // tổng thời gian muốn hiển thị (ms)
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

    const typingText = message.streaming
      ? outputContent?.slice(0, displayed)
      : outputContent;
    const {
      preparedContent: output,
      inlinedElements: outputInlinedElements,
      refElements: outputRefElements,
    } = prepareContent({
      elements,
      id: message.id,
      content: typingText,
      language: message.language,
    });

    const displayInput = message.input && message.showInput;

    const isMessage = message.type.includes("message");

    const outputMarkdown = (
      <>
        {!isMessage && displayInput && message.output ? (
          <div className="font-medium">Output</div>
        ) : null}
        <Markdown
          allowHtml={allowHtml}
          latex={latex}
          refElements={outputRefElements}
        >
          {output}
        </Markdown>
      </>
    );

    let inputMarkdown;

    if (displayInput) {
      const inputContent =
        message.streaming && message.input
          ? message.input + CURSOR_PLACEHOLDER
          : message.input;
      const { preparedContent: input, refElements: inputRefElements } =
        prepareContent({
          elements,
          id: message.id,
          content: inputContent,
          language:
            typeof message.showInput === "string"
              ? message.showInput
              : undefined,
        });

      inputMarkdown = (
        <>
          <div className="font-medium">Input</div>

          <Markdown
            allowHtml={allowHtml}
            latex={latex}
            refElements={inputRefElements}
          >
            {input}
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
        {!!inputMarkdown || output ? markdownContent : null}
        <InlinedElements elements={outputInlinedElements} />
      </div>
    );
  }
);

export { MessageContent };
