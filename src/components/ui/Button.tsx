import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/src/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'danger'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white dark:ring-offset-slate-950",
          {
            'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200': variant === 'default',
            'bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-100': variant === 'outline',
            'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50': variant === 'ghost',
            'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700': variant === 'secondary',
            'bg-red-500 text-white hover:bg-red-600 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800': variant === 'danger',
            'h-10 py-2 px-4': size === 'default',
            'h-9 px-3 rounded-md': size === 'sm',
            'h-11 px-8 rounded-md': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
