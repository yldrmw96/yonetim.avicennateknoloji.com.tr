
import { SeoPage } from "./client";
import { SessionService } from "@/lib/services/session.service";

export default async function Page() {
  const user = await SessionService.getUserFromCookie();
  const selectedSiteID = Number(user?.selectedSiteId);

  async function getSeoSettings(siteID: number) {
    "use server"
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/seo/get/by_site/${siteID}`, {
      method: "POST"
    })
    .then(res => res.json())
    // console.log(result);
    return result;
  }
  

  const defaultValues = await getSeoSettings(selectedSiteID);

  return <SeoPage 
  defaultValues={defaultValues} 
  getSeoSettings={getSeoSettings} />
}