import { cn } from '@/lib/utils';

interface DisplayProps {
  variant?: 's-black' | 's-white';
  children: React.ReactNode;
  className?: string;
}

const classNameByVariant = {
  's-black': 'text-[24px] text-[#FAFAFA] font-[900] leading-[32px]',
  's-white': 'text-[24px] text-[#13161B] font-[900] leading-[32px]',
};

export default function Display({
  variant = 's-black',
  children,
  className,
  ...props
}: DisplayProps) {
  return (
    <h2 className={cn(classNameByVariant[variant], className)} {...props}>
      {children}
    </h2>
  );
}
