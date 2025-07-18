'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MessageListItemProps {
  id: string;
  senderName: string;
  date: string;
  subject: string;
  body: string;
}

export function MessageListItem({ data, className, ...props }: { data: MessageListItemProps, className?: string, props: React.ComponentProps<typeof Link> }) {
  const { id, senderName, date, subject, body } = data;
  const pathname = usePathname();
  const isActive = (pathname.split("/")[1]) === ("messages") && (pathname.split("/")[2]) === (id);
  const dateFormatted = new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return (

    <Link href={`/messages/${id}`}
      className={cn("hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 px-6 text-sm leading-tight whitespace-nowrap last:border-b-0 w-full", isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "", className)}  {...props} >

      <div className="flex w-full items-center gap-2">
        <span className="text-xs font-medium opacity-70">Kimden: {senderName}</span>
        <span className="ml-auto text-xs opacity-70">{dateFormatted}</span>
      </div>
      <span className="font-bold text-sm">{subject}</span>
      <span className="line-clamp-2 text-xs whitespace-break-spaces">{body}
      </span>
    </Link>

  )
}