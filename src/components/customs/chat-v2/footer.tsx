import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MutableRefObject, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import SubmitButton from "./SubmitButton";
import Input, { InputMethods } from "./message/message-composer/input";
import ConfigurationXModal from "../chat/configuration-x-modal";
import { useConfigurationStore } from "@/stores/use-global-state";

interface Props {
  autoScrollRef: MutableRefObject<boolean>;
  showIfEmptyThread?: boolean;
  onSubmit: (value: string) => void;
  isSubmitting: boolean;
}

export default function ChatFooter({
  autoScrollRef,
  onSubmit,
  isSubmitting,
}: Props) {
  const { config, setConfig } = useConfigurationStore();
  const inputRef = useRef<InputMethods>(null);
  const [value, setValue] = useState("");
  const [isReplies, setIsReplies] = useState(true);
  const [showConfigurationX, setShowConfigurationX] = useState(false);
  const submit = () => {
    onSubmit(value);
    if (autoScrollRef) {
      autoScrollRef.current = true;
    }
    if (inputRef.current) {
      setValue("");
      inputRef.current.reset();
    }
  };
  const handleConfigurationX = () => {
    setShowConfigurationX(true);
  };
  const changeMode = () => {
    setIsReplies(!isReplies);
    setConfig({ ...config, isReplies: !isReplies });
  };
  return (
    <div className={cn("relative flex flex-col items-center gap-2 w-full")}>
      <Card
        id="message-composer"
        className="flex flex-col border border-rivalz-border-secondary w-full"
      >
        <Input
          className="text-white"
          ref={inputRef}
          id="chat-input"
          autoFocus
          onChange={setValue}
          onEnter={submit}
          placeholder="Type your message here..."
          setSelectedCommand={() => {}}
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center gap-1 justify-between w-full">
            <div className="flex flex-row items-center gap-2">
              {/* <Button variant={"outline"} className="w-11 h-11 p-0" disabled>
                <Image
                  src={"/icons/attach-gray.svg"}
                  alt={"attach-file"}
                  width={20}
                  height={20}
                />
              </Button> */}

              <Button variant={"outline"} onClick={handleConfigurationX}>
                <Image
                  src={"/icons/twitter-gray.svg"}
                  alt={"attach-file"}
                  width={20}
                  height={20}
                />
                Configuration
              </Button>
              <Button
                variant={isReplies ? "outline" : "default"}
                onClick={changeMode}
              >
                {!isReplies && (
                  <Image
                    src={"/icons/check-gray.svg"}
                    alt={"attach-file"}
                    width={20}
                    height={20}
                  />
                )}
                Tweet
              </Button>
              <Button
                variant={!isReplies ? "outline" : "default"}
                onClick={changeMode}
              >
                {isReplies && (
                  <Image
                    src={"/icons/check-gray.svg"}
                    alt={"attach-file"}
                    width={20}
                    height={20}
                  />
                )}
                Reply
              </Button>
            </div>

            <SubmitButton onSubmit={submit} disabled={isSubmitting} />
          </div>
        </div>
      </Card>
      {showConfigurationX && (
        <ConfigurationXModal
          open={showConfigurationX}
          onClose={() => setShowConfigurationX(false)}
          isReplies={isReplies}
        />
      )}
    </div>
  );
}
