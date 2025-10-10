import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/components/ui/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "retro-button",
        destructive:
          "retro-button bg-[var(--button-destructive-bg)] border-[var(--button-destructive-border)] text-white hover:bg-[var(--button-destructive-hover)]",
        outline:
          "border-2 border-[var(--button-outline-border)] bg-transparent text-[var(--button-outline-text)] hover:bg-[var(--button-outline-hover-bg)] hover:text-[var(--button-outline-hover-text)] hover:shadow-[var(--button-outline-hover-shadow)] transition-all duration-300",
        secondary:
          "retro-button bg-[var(--button-secondary-bg)] border-[var(--button-secondary-border)]",
        ghost: "bg-transparent text-[var(--button-ghost-text)] hover:bg-[var(--button-ghost-hover-bg)] hover:text-[var(--button-ghost-hover-text)] border border-transparent hover:border-[var(--button-ghost-hover-border)]",
        link: "text-[var(--button-link-text)] underline-offset-4 hover:underline hover:text-[var(--button-link-hover-text)] transition-colors",
        retro: "retro-button",
        neon: "bg-transparent border-2 border-[var(--button-neon-border)] text-[var(--button-neon-text)] hover:bg-[var(--button-neon-hover-bg)] hover:text-[var(--button-neon-hover-text)] hover:shadow-[var(--button-neon-hover-shadow)] transition-all duration-300 font-bold uppercase tracking-wider",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
