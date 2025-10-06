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
          "retro-button bg-gradient-to-r from-red-500 to-red-700 border-red-400 text-white hover:from-red-600 hover:to-red-800",
        outline:
          "border-2 border-cyan-400 bg-transparent text-cyan-400 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300",
        secondary:
          "retro-button bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400",
        ghost: "bg-transparent text-cyan-400 hover:bg-cyan-400/10 hover:text-pink-400 border border-transparent hover:border-cyan-400",
        link: "text-cyan-400 underline-offset-4 hover:underline hover:text-pink-400 transition-colors",
        retro: "retro-button",
        neon: "bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black hover:shadow-[0_0_20px_rgba(255,0,255,0.8)] transition-all duration-300 font-bold uppercase tracking-wider",
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
