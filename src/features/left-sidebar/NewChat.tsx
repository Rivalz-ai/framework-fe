"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname, useRouter } from "next/navigation";
import Typography from "@/components/customs/typography";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/stores";

type NewChatDialogProps = {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
};

export const NewChatDialog = ({
  open,
  handleClose,
  handleConfirm,
}: NewChatDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent id="new-chat-dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Conversation</DialogTitle>
          <DialogDescription>
            Would you like to start a new conversation?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleConfirm} id="confirm">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isCollapsed: boolean;
  isAuthenticated: boolean;
  navigate?: (to: string) => void;
}

const NewChatButton = ({
  isCollapsed,
  isAuthenticated,
  navigate,
  ...buttonProps
}: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const [{ swarmSelected }, setGlobalState] = useGlobalStore();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    // const temp = swarmSelected;
    // setGlobalState({
    //   swarmSelected: {
    //     project_id: "",
    //     project_name: "",
    //     status: "",
    //     unique_name: "",
    //     logo: "/mock-avatar.png",
    //   },
    // });
    // setTimeout(() => {
    //   setGlobalState({
    //     swarmSelected: temp,
    //   });
    // }, 100);

    // setCurrentThreadId(undefined);
    //Will optimize this issue later
    if (pathName === "/") {
      // Logic to refresh or reset the state
      window.location.reload(); // This will refresh the page
      // Alternatively, reset the state here
    } else {
      router.push("/");
    }

    handleClose();
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* <Button
              variant="ghost"
              size="icon"
              id="new-chat-button"
              className="text-muted-foreground hover:text-muted-foreground"
              onClick={handleClickOpen}
              {...buttonProps}
            >
              +
            </Button> */}
            <Button
              disabled={!isAuthenticated}
              variant={"default"}
              className={cn(
                "w-full transition-transform duration-300 ease-in-out",
                isCollapsed ? "w-11 h-11 p-0" : ""
              )}
              onClick={handleClickOpen}
              {...buttonProps}
            >
              <Image
                src={
                  !isAuthenticated ? "/icons/edit-gray.svg" : "/icons/edit.svg"
                }
                alt="edit"
                width={20}
                height={20}
              />
              {!isCollapsed && (
                <Typography.Text variant="m-bold" className="text-[#0C0E12]">
                  New Chat
                </Typography.Text>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Create a new conversation</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <NewChatDialog
        open={open}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      />
    </div>
  );
};

export default NewChatButton;
