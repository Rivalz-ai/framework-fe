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

export interface DropdownItemProps {
  label: string;
  iconSrc?: string;
  value: string | number;
}

interface DropdownIconCustomProps {
  label: string;
  selectedValue: string | number;
  items: DropdownItemProps[];
  onSelect: (value: string | number) => void;
  menuContentClassName?: string;
  errorMessage?: string;
  isLoading?: boolean;
  noBorder?: boolean;
  customComponent?: React.ReactNode;
  menuClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  hideValueIcon?: boolean;
}

export default function DropdownIconCustom({
  label,
  selectedValue,
  items,
  onSelect,
  menuContentClassName,
  errorMessage,
  isLoading,
  noBorder,
  customComponent,
  menuClassName,
  labelClassName,
  buttonClassName,
  hideValueIcon,
}: DropdownIconCustomProps) {
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

  useEffect(() => {
    if (!selectedValue && items.length > 0) {
      onSelect(items[0].value);
    }
  }, [items, selectedValue, onSelect]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger asChild>
        <div className={cn("flex flex-col gap-y-2", menuClassName)}>
          <Button
            variant="outline"
            size="default"
            ref={triggerRef}
            className={cn(
              errorMessage && "border-[1px] border-[#F98188]",
              buttonClassName
            )}
            disabled={isLoading}
          >
            <div className="flex flex-1 w-full items-center justify-between gap-2 relative">
              <div className="flex flex-row items-center gap-2">
                {selectedValue ? (
                  <div className="flex flex-row w-full items-center gap-2">
                    {!hideValueIcon && (
                      <Image
                        src={
                          items.find((item) => item.value === selectedValue)
                            ?.iconSrc as string
                        }
                        alt={"icon sort"}
                        width={16}
                        height={16}
                        className="h-5 w-5"
                      />
                    )}

                    <Typography.Text
                      variant="m-bold"
                      className={cn("text-[#94979C]", labelClassName)}
                    >
                      {items.find((item) => item.value === selectedValue)
                        ?.label || label}
                    </Typography.Text>
                  </div>
                ) : (
                  <Typography.Text variant="m-bold" className={labelClassName}>
                    {label}
                  </Typography.Text>
                )}
              </div>

              <Image
                src={isOpen ? "/icons/arrow-up.svg" : "/icons/arrow-down.svg"}
                alt={isOpen ? "arrow-up" : "arrow-down"}
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
                  "my-1 bg-rivalz-badge-border-dark",
                "min-h-11"
              )}
              key={`${item.value}-${index}`}
              onClick={() => onSelect(item.value)}
            >
              <div className="flex flex-row w-full items-center gap-2">
                {item.iconSrc && (
                  <Image
                    src={item.iconSrc}
                    alt={"icon sort"}
                    width={16}
                    height={16}
                    className="h-5 w-5"
                  />
                )}
                {item.label}
              </div>
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
