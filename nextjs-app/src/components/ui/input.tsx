'use client';
import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`flex h-10 w-full rounded-full border border-[#f7c7d3] bg-white px-3 py-2 text-base placeholder:text-[#4b2e2b]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b96a82] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
