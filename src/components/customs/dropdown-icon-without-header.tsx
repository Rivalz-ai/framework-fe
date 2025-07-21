"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Typography from "./typography";

interface DropdownItemProps {
  label: string;
  iconSrc?: string;
  value: string | number;
}

interface DropdownWithoutHeaderProps {
  selectedValue: string | number;
  items: DropdownItemProps[];
  onSelect: (value: string | number) => void;
  menuContentClassName?: string;
  errorMessage?: string;
}

export default function DropdownWithoutHeader({
  selectedValue,
  items,
  onSelect,
  menuContentClassName,
}: DropdownWithoutHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!selectedValue && items.length > 0) {
      onSelect(items[0].value);
    }
  }, [items, selectedValue, onSelect]);

  const handleSelect = (value: string | number) => {
    onSelect(value);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "w-full max-h-72 mt-[88px] border border-rivalz-border-secondary px-2 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#373A40] scrollbar-track-transparent",
        menuContentClassName
      )}
    >
      {items.map((item, index) => (
        <div
          className={cn(
            selectedValue === item.value && "my-1 bg-rivalz-badge-border-dark",
            "flex min-h-11 justify-start items-center rounded-[10px] hover:bg-rivalz-badge-border-dark hover:cursor-pointer p-2"
          )}
          key={`${item.value}-${index}`}
          onClick={() => handleSelect(item.value)}
        >
          <div className="flex flex-row gap-2 items-center justify-start">
            {item.iconSrc && (
              <Image
                src={item.iconSrc}
                alt={"icon sort"}
                width={16}
                height={16}
                className="h-5 w-5"
              />
            )}
            <Typography.Text
              variant="m-medium"
              className={cn(
                selectedValue === item.value
                  ? "text-rivalz-text-primary"
                  : "text-rivalz-text-secondary"
              )}
            >
              {item.label}
            </Typography.Text>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-2 flex justify-center items-center">
          No items
        </div>
      )}
    </div>
  );
}
