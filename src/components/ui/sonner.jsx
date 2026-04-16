import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";
import { RiCheckboxCircleLine, RiInformationLine, RiErrorWarningLine, RiCloseCircleLine, RiLoader4Line } from "@remixicon/react"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group "
      icons={{
        success: (
          <RiCheckboxCircleLine className="size-5 text-[#378ADD]" />
        ),
        info: (
          <RiInformationLine className="size-5 text-[#378ADD]" />
        ),
        warning: (
          <RiErrorWarningLine className="size-5 text-[#378ADD]" />
        ),
        error: (
          <RiCloseCircleLine className="size-5 text-[#378ADD]" />
        ),
        loading: (
          <RiLoader4Line className="size-5 text-[#378ADD] animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)"
        }
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          title: "text-md font-geist",
          
        },
      }}
      {...props} />
  );
}

export { Toaster }
