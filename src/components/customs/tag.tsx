import React from 'react';
import { cn } from '@/lib/utils';
interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  className?: string;
  children?: React.ReactNode;
}
export default function Tag({ text, className, children, ...props }: TagProps) {
  return (
    <div
      className={cn(
        'flex w-fit items-center gap-x-2 rounded-[9px] border border-[#373A40] px-2 py-[2px] text-xs text-[#CECFD2]',
        className,
      )}
      {...props}
    >
      {children}
      {text}
    </div>
  );
}
