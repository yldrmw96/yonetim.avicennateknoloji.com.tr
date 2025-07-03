import { Metadata } from "next";
import AssetCatalog from "./client";
import { SessionService } from "@/lib/services/session.service";

export const metadata: Metadata = {
  title: "Varlık Kataloğu | " + process.env.NEXT_PUBLIC_SITE_NAME,
  description: "Varlık Kataloğu | " + process.env.NEXT_PUBLIC_SITE_NAME,
};

export default async function AssetCatalogPage() {
  const user = await SessionService.getUserFromCookie();
  const selectedSiteID = Number(user?.selectedSiteId);

  async function getAssets(siteID: number) {
    "use server"
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/get/by-site/${siteID}`, {
      method: "POST"
    })
    .then(res => res.json())
    return result;
  }

  const defaultValues = await getAssets(selectedSiteID);

  return (
    <AssetCatalog
    defaultValuesFromServer={defaultValues} />  
  );
}
