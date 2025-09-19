import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * @typedef {Object} InputOTPProps
 * @property {string} [className] - Additional class names for styling.
 * @property {string} [containerClassName] - Additional class names for the container.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A component for inputting one-time passwords.
 * This component is based on the input-otp library.
 * @param {InputOTPProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props} />
))
InputOTP.displayName = "InputOTP"

/**
 * @typedef {Object} InputOTPGroupProps
 * @property {string} [className] - Additional class names for styling.
 * @property {React.ReactNode} children - The content of the component.
 */

/**
 * A group of OTP input slots.
 * @param {InputOTPGroupProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

/**
 * @typedef {Object} InputOTPSlotProps
 * @property {number} index - The index of the slot.
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A single slot in the OTP input.
 * @param {InputOTPSlotProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    (<div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}>
      {char}
      {hasFakeCaret && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>)
  );
})
InputOTPSlot.displayName = "InputOTPSlot"

/**
 * A separator for the OTP input.
 */
const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
