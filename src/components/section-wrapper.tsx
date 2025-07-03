import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const SectionWrapper = forwardRef<HTMLDivElement, { children: React.ReactNode, className?: string }>(({ children, className }, ref) => {
  return <div ref={ref} className={cn("px-6", className)}>{children}</div>;
});

SectionWrapper.displayName = "SectionWrapper";

export default SectionWrapper;