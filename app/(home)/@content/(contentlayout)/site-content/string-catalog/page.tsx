import { Metadata } from "next";
import StringCatalogLanguageListMenuClient from "./client";
import { SessionService } from "@/lib/services/session.service";

export const metadata: Metadata = {
  title: "Dize Kataloğu | " + process.env.NEXT_PUBLIC_SITE_NAME,
  description: "Dize Kataloğu | " + process.env.NEXT_PUBLIC_SITE_NAME
}


export default async function StringCatalogLanguageListPage() {

  const user = await SessionService.getUserFromCookie();
  const selectedSiteID = user?.selectedSiteId;

  async function fetchLanguages(siteID: number) {
    "use server"
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/languages/get/by-site/${siteID}`, {
      method: "POST"
    })
      .then(res => res.json())
    // console.log("languages", result);
    return result;
  }

  const defaultValues = await fetchLanguages(selectedSiteID);

  return (
    <StringCatalogLanguageListMenuClient
      defaultValuesFromServer={defaultValues}
      fetchLanguages={fetchLanguages}
    />
  )
}