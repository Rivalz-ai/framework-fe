import { cn } from '@/lib/utils';
import React from 'react';

interface TextProps {
  variant?:
    | 'xs-medium'
    | 's-medium'
    | 's-bold'
    | 's-regular'
    | 'l-regular'
    | 'l-medium'
    | 'l-uppercase-black'
    | 'l-bold'
    | 'm-bold'
    | 'm-regular'
    | 'm-medium';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const classNameByVariant = {
  'xs-medium': 'text-[#717680] text-[12px] font-[500] leading-[16px]',
  's-medium': 'text-[#FAFAFA] text-[14px] font-[500] leading-[20px]',
  's-bold': 'text-[#94979C] text-[14px] font-[700] leading-[20px]',
  's-regular': 'text-[#94979C] text-[14px] font-[400] leading-[20px]',
  'l-regular': 'text-[#94979C] text-[18px] font-[400] leading-[24px]',
  'l-uppercase-black':
    'text-[#FAFAFA] text-[18px] font-[900] leading-[28px] tracking-[0.9px] uppercase',
  'l-medium': 'text-[#FAFAFA] text-lg font-[500] leading-[28px]',
  'l-bold': 'text-[#FAFAFA] text-[18px] font-[700] leading-[28px]',
  'm-bold': 'text-[#94979C] text-[16px] font-[700] leading-[24px]',
  'm-regular': 'text-[#94979C] text-[16px] font-[400] leading-[24px]',
  'm-medium': 'text-[#FAFAFA] text-[18px] font-[500] leading-[28px]',
};

export default function Text({
  variant = 's-medium',
  children,
  className,
  onClick,
  ...props
}: TextProps) {
  return (
    <span className={cn(classNameByVariant[variant], className)} onClick={onClick} {...props}>
      {children}
    </span>
  );
}
