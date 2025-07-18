import * as React from "react";

import { cn } from "@/lib/utils";

function EditableInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground hover:[:not(:focus)]:!underline hover:[:not(:focus)]:cursor-default selection:bg-primary selection:text-primary-foreground  border-input flex min-w-0 w-full bg-transparent rounded-sm px-2 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus:!ring-0 focus:!ring-offset-0  focus:bg-black/10  shadow-none group-[.selected-row]/row:text-white disabled:!opacity-100",
        className
      )}
      {...props}
    />
  );
}

export { EditableInput };
