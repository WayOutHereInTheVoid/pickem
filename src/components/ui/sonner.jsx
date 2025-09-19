import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

/**
 * @typedef {Object} ToasterProps
 * @property {string} [className] - Additional class names for styling.
 */

/**
 * A toaster component that displays toast messages.
 * This component is based on the sonner library.
 * @param {ToasterProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    (<Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props} />)
  );
}

export { Toaster }
