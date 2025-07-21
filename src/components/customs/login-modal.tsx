"use client";
import Typography from "@/components/customs/typography";
import Image from "next/image";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { signIn } from "next-auth/react";

interface LoginModalProps {
  open: boolean;
}

export default function LoginModal({ open }: LoginModalProps) {
  return (
    <Dialog open={open} modal={true}>
      <DialogContent className="fixed inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" />
        <div className="relative w-full max-w-md space-y-8 bg-[#13161B] p-8 rounded-3xl border-none">
          <div className="space-y-2 text-center">
            <Typography.Text variant="l-medium" className="text-white">
              Log in to your Swarm Control
            </Typography.Text>
          </div>

          <div className="space-y-6">
            <Button
              onClick={() => signIn("twitter")}
              variant="outline"
              className="w-full border-[#373A40] hover:bg-[#1C1F26]"
            >
              <Image
                src="/icons/twitter-gray.svg"
                alt="X Logo"
                width={24}
                height={24}
                className="mr-2"
              />
              <Typography.Text variant="m-bold">
                Log in with X account
              </Typography.Text>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
