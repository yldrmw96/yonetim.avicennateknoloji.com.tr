
import { Metadata } from "next";
import NoWebsiteClient from "./client";
import { SessionService } from "@/lib/services/session.service";

export const metadata: Metadata = {
  title: "Web sitesi bulunamadı | " + process.env.NEXT_PUBLIC_SITE_NAME,
  description: "Üzerinize kayıtlı bir web sitesi bulunamadı. Lütfen yönetici ile iletişime geçiniz. | " + process.env.NEXT_PUBLIC_SITE_NAME,
};

export default function Page() {

  return (<NoWebsiteClient handleLogout={
    async () => {
    await SessionService.logout();
  }
} />)
}