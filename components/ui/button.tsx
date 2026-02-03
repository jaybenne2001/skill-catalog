import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
  size?: 'default' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none",
          variant === 'default' && "bg-blue-600 text-white hover:bg-blue-700",
          variant === 'outline' && "border border-gray-300 bg-white hover:bg-gray-100 text-gray-900",
          size === 'default' && "h-10 px-4 py-2",
          size === 'lg' && "h-12 px-8 text-lg",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
