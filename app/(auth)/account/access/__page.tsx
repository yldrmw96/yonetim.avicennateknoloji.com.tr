
import { Metadata } from "next";
import PageClientSide from "./client";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: `Giriş Yap | ${env.NEXT_PUBLIC_SITE_NAME}`,
  description: `Giriş Yap | ${env.NEXT_PUBLIC_SITE_NAME}`,
};

export default function Page() {
  return <PageClientSide />
}