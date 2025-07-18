import { cn } from "@/lib/utils"

function Skeletoned({ className, children, loading,as, ...props }: React.ComponentProps<"div"> & { loading: boolean, as?: React.ElementType }) {
  const Component = as || "div"
  return (
    <>
    {loading ? (
    <Component
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    >
    </Component>
    ) : (
      children
    )}
    </>
  )
}

export { Skeletoned }
