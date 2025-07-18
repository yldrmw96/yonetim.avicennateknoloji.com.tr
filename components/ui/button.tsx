import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { ActivityIndicator } from "../global/activity-indicator"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none  shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer max-h-[var(--default-min-list-item-height)]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 [&_svg:not([class*='size-'])]:size-4",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 [&_svg:not([class*='size-'])]:size-4",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-4",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 [&_svg:not([class*='size-'])]:size-4",
        borderless:
          "text-primary shadow-xs border-none bg-transparent font-semibold border-l border-r [&_svg:not([class*='size-'])]:size-4",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4",
        link: "text-primary underline-offset-4 hover:underline [&_svg:not([class*='size-'])]:size-4",
        flat:""
      },
      size: {
        default: " px-4 py-2 has-[>svg]:px-3",
        sm: "py-[0.16rem] rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "py-4 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        none: "",

      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}


export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start gap-4"
      title="Görünümü Değiştir"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:hidden dark:scale-0 dark:-rotate-90" />
      <Moon className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all hidden dark:block dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
      <span className="text-xs">Görünümü Değiştir</span>
    </Button>
  )
}
const Apply = ({isLoading,className,action,disabled,form, ...props}:{isLoading:boolean,className?:string,action?:()=>void,disabled?:boolean,form?:string,props?:React.ComponentProps<"button">}) => {
  return (
    <Button
      form={form}
      type="submit"
      className={cn("font-semibold ms-auto col-start-3 text-primary bg-transparent",className)}
      variant="ghost"
      onClick={action}
      disabled={disabled}
      {...props}
    >
      {isLoading ? <ActivityIndicator /> : "Uygula"}
    </Button>
  )
}


const EditModeButton = ({ isEditMode, className, action, disabled, ...props }: { isEditMode: boolean, className?: string, action?: () => void, disabled?: boolean, props?: React.ComponentProps<"button"> }) => {
  return (
    <Button
      className={cn("font-semibold ms-auto col-start-3 text-primary bg-transparent", className)}
      variant="ghost"
      onClick={action}
      disabled={disabled}
      {...props}
    >
      {isEditMode ? "Bitti" : "Düzenle"}
    </Button>
  )
}


Button.ThemeSwitcher = ThemeSwitcher;
Button.Apply = Apply;
Button.EditMode = EditModeButton;

export { Button, buttonVariants }

