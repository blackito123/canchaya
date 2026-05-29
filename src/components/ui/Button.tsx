import React, { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex items-center justify-center rounded-[1rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terra disabled:pointer-events-none disabled:opacity-50",
        {
          'bg-terra text-white hover:bg-terra-dark': variant === 'primary',
          'bg-sand text-charcoal hover:bg-sand-dark': variant === 'secondary',
          'border border-sand-dark bg-transparent text-charcoal hover:bg-sand/30': variant === 'outline',
          'bg-transparent text-charcoal hover:bg-sand/50': variant === 'ghost',
          'h-9 px-4 text-sm': size === 'sm',
          'h-11 px-6 text-base': size === 'md',
          'h-14 px-8 text-lg rounded-[1.25rem]': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}
