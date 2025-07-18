import { Metadata } from "next";

import Client from "../../../../../components/client/dashboard";
import { SessionService } from "@/lib/services/session.service";

export const metadata: Metadata = {
  title: "Anasayfa | " + process.env.NEXT_PUBLIC_SITE_NAME,
  description: "Anasayfa | " + process.env.NEXT_PUBLIC_SITE_NAME,
};

export default async function DashboardPage() {

  const user = await SessionService.getUserFromCookie();



  const fetchStatsFn = async ({ siteId }: { siteId: string }) => {
    "use server"
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/stats/get/by-site", {
      method: "POST",
      body: JSON.stringify({ siteId })
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  }

  const data = await fetchStatsFn({ siteId: user?.selectedSiteId });

  return (
    <Client
      unreadMessages={data[0].number_of_unread_messages}
      totalVisits={1023}
      totalUsers={data[0].number_of_users}
      fetchStatsFn={fetchStatsFn}
    />
  )
}
