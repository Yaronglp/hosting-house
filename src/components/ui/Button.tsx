import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/components/ui/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] border border-solid text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer appearance-none bg-clip-padding min-h-12",
  {
    variants: {
      variant: {
        default:
          "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)] hover:border-[hsl(var(--primary)/0.9)]",
        destructive:
          "border-[hsl(var(--destructive))] bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive)/0.9)] hover:border-[hsl(var(--destructive)/0.9)]",
        outline:
          "border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[var(--overlay-accent-8)]",
        secondary:
          "border-[hsl(var(--secondary))] bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.8)]",
        ghost:
          "border-transparent bg-transparent text-[hsl(var(--foreground))] hover:bg-[var(--overlay-accent-8)] hover:border-transparent",
        link: "border-transparent bg-transparent text-[hsl(var(--primary))] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-5 py-3",
        sm: "h-10 min-h-10 px-4 py-2 text-base",
        lg: "h-14 px-8 py-3",
        icon: "h-12 w-12 min-h-12",
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
