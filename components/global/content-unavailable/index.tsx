import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

interface ContentUnavailableProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ContentUnavailable(
  {
    title,
    description,
    icon,
    ...props
  }: ContentUnavailableProps
) {

  if (icon === null && description === null && title === null) {
    return null;
  }

  return (
    <div {...props} className={cn(clss.container, props.className)}>
      {icon && (
        <span className={cn(clss.iconWrapper)}>
          {icon}
        </span>
      )}
      {title && <h1 className={cn(clss.title)}>{title}</h1>}
      {description && (<p className={cn(clss.description)}>{description}</p>)}
    </div>
  );
}

const clss: Record<string, ClassValue> = {
  container: "flex flex-col items-center",
  iconWrapper: "[&>svg]:text-5xl",
  title: "font-bold text-xl text-center",
  description: "font-medium text-sm text-opacity-50 text-gray-500 text-center",
}