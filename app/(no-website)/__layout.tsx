import { ReactNode } from "react";
import { Metadata } from "next";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: `Websiteniz bulunamadı | ${env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Websiteniz bulunamadı | ${env.NEXT_PUBLIC_SITE_NAME}`,
};

type Props = {
  children: ReactNode
}

export default function Layout({ 
  children 
}: Props) {
  return children
}
