'use client';
import * as React from "react"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`flex min-h-[120px] w-full rounded-full border border-[#f7c7d3] bg-white px-3 py-2 text-base placeholder:text-[#4b2e2b]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b96a82] disabled:cursor-not-allowed disabled:opacity-50 resize-none ${className}`}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"

export { Textarea }
