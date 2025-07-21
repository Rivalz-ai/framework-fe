import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:bg-[#23262E] disabled:text-[#373A40] disabled:border disabled:border-[#373A40] disabled:cursor-not-allowed",

  {
    variants: {
      variant: {
        default:
          "bg-rivalz-badge-fg-primary font-bold text-rivalz-bg-0C0E12 text-base leading-[24px] py-5 px-4 hover:bg-rivalz-badge-fg-primary/90 ",
        outline:
          "border border-[#373A40] bg-transparent text-[#94979C] font-bold leading-[24px]  hover:text-[#94979C]/80",
        outlineGreen:
          "border border-[#2D7D44] bg-transparent text-[#3BB25D] font-bold leading-[24px]  hover:text-[#3BB25D]/80 disabled:border-[#235f34] disabled:text-[#235f34] disabled:bg-[#174725]",
        noBorder:
          "border-none bg-transparent text-[#FAFAFA] font-bold leading-[24px]  hover:text-[#eae5e5]/80 disabled:border-[#9fa3a0] disabled:text-[#235f34] disabled:bg-[#174725]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // outline:
        //   'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { isLoading?: boolean }
>(
  (
    { className, variant, size, asChild = false, isLoading = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isLoading && "relative cursor-not-allowed opacity-50"
        )}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-5 w-5 animate-spin text-[#69FF93]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          </span>
        )}
        <div
          className={cn(
            "flex w-full flex-row items-center justify-center gap-x-1",
            isLoading ? "opacity-0" : ""
          )}
        >
          {props.children}
        </div>
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
