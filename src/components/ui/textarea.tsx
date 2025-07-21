import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'px-4 py-[10px]',
          'text-sm font-normal text-[#FAFAFA]',
          'flex min-h-[80px] w-full rounded-[10px] border border-input border-rivalz-border-primary bg-transparent ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-rivalz-border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:ring-offset- focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-rivalz-badge-fg-primary',
          'placeholder:text-[#94979C]',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
