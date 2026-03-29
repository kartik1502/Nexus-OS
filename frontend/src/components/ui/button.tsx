import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "default" | "sm" | "lg" | "icon"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", isLoading, children, disabled, ...props }, ref) => {
    
    // Applying ui-ux-pro-max guidelines for min-height 44px touch targets and full accessible focus states
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      primary: "bg-accent text-white hover:bg-accent-hover",
      secondary: "bg-bg-elevated text-text-primary hover:bg-bg-hover",
      outline: "border border-border bg-transparent hover:bg-bg-hover text-text-primary",
      ghost: "hover:bg-bg-hover text-text-primary",
      danger: "bg-danger text-white hover:opacity-90",
    }
    
    const sizes = {
      default: "h-11 px-4 py-2", // 44px height for touch targets
      sm: "h-9 rounded-md px-3",
      lg: "h-12 rounded-md px-8",
      icon: "h-11 w-11",
    }
    
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
