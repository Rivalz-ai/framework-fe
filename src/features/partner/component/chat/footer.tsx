import Input, {
  InputMethods,
} from "@/components/customs/chat/message-composer/Input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import SubmitButton from "./SubmitButton";
import DropdownIconCustom, {
  DropdownItemProps,
} from "@/components/customs/dropdown-icon-custom";

interface Props {
  autoScrollRef: MutableRefObject<boolean>;
  showIfEmptyThread?: boolean;
  onSubmit: (value: string, modelId?: string | number) => void;
  models: DropdownItemProps[];
  isSubmitting: boolean;
}

export default function ChatFooter({ autoScrollRef, onSubmit, models }: Props) {
  const inputRef = useRef<InputMethods>(null);
  const [value, setValue] = useState("");
  const [selectedModel, setSelectedModel] = useState<number | string>("");

  const submit = () => {
    onSubmit(value, selectedModel);
    if (autoScrollRef) {
      autoScrollRef.current = true;
    }
    if (inputRef.current) {
      setValue("");
      inputRef.current.reset();
    }
  };

  useEffect(() => {
    setSelectedModel("");
  }, [models]);

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
            <div className="flex flex-row items-center gap-1">
              {/* <Button variant={"outline"} className="w-11 h-11 p-0" disabled>
                <Image
                  src={"/icons/attach-gray.svg"}
                  alt={"attach-file"}
                  width={20}
                  height={20}
                />
              </Button> */}

              {models.length > 0 && (
                <DropdownIconCustom
                  hideValueIcon
                  label="Auto select model"
                  selectedValue={selectedModel}
                  items={models}
                  onSelect={setSelectedModel}
                  labelClassName="text-white/40 font-normal text-xs leading-5"
                  menuClassName="bg-rivalz-bg-primary"
                  buttonClassName="bg-rivalz-bg-primary border-none"
                />
              )}
            </div>
            <SubmitButton onSubmit={submit} disabled={false} />
          </div>
        </div>
      </Card>
    </div>
  );
}
