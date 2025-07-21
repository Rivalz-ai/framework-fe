"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Typography from "./typography";
import Spinner from "./spinner";

interface DropdownItemProps {
  label: string;
  value: string | number;
}

interface DropdownCustomProps {
  label: string;
  selectedValue: string | number;
  items: DropdownItemProps[];
  onSelect: (value: string | number) => void;
  menuContentClassName?: string;
  errorMessage?: string;
  isLoading?: boolean;
  noBorder?: boolean;
  customComponent?: React.ReactNode;
  selectClassName?: string;
}

export default function DropdownCustom({
  label,
  selectedValue,
  items,
  onSelect,
  menuContentClassName,
  errorMessage,
  isLoading,
  noBorder,
  customComponent,
  selectClassName,
}: DropdownCustomProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuWidth, setMenuWidth] = useState<string>("auto");

  useEffect(() => {
    const updateMenuWidth = () => {
      if (triggerRef.current) {
        setMenuWidth(`${triggerRef.current.offsetWidth}px`);
      }
    };

    updateMenuWidth();
    window.addEventListener("resize", updateMenuWidth);
    return () => {
      window.removeEventListener("resize", updateMenuWidth);
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-col gap-y-2">
          <Button
            variant="outline"
            size="default"
            ref={triggerRef}
            className={cn(
              errorMessage && "border-[1px] border-[#F98188]",
              selectClassName
            )}
            disabled={isLoading}
          >
            <div className="flex flex-1 w-full items-center justify-between gap-2 relative">
              {selectedValue
                ? items.find((item) => item.value === selectedValue)?.label ||
                  label
                : label}

              <Image
                src="/icons/arrow-down.svg"
                alt="arrow-down"
                width={16}
                height={16}
                className="h-5 w-5"
              />
              {isLoading && (
                <Spinner className="absolute right-0 left-0 mx-auto" />
              )}
            </div>
          </Button>
          {errorMessage && (
            <Typography.Text variant="s-regular" className="text-[#F98188]">
              {errorMessage}
            </Typography.Text>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          "w-full",
          noBorder && "border-none",
          menuContentClassName
        )}
        style={{ width: menuWidth }}
      >
        <DropdownMenuGroup>
          {customComponent}

          {items.map((item, index) => (
            <DropdownMenuItem
              className={cn(
                selectedValue === item.value &&
                  "my-1 bg-rivalz-badge-border-dark"
              )}
              key={`${item.value}-${index}`}
              onClick={() => onSelect(item.value)}
            >
              {item.label}
            </DropdownMenuItem>
          ))}

          {items.length === 0 && (
            <DropdownMenuItem className="text-center py-2 flex justify-center items-center">
              No items
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
