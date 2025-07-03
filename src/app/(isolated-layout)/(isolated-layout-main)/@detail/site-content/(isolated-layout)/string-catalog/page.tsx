import StringCatalogTable from "./client";
import { SessionService } from "@/lib/services/session.service";

export default async function Page() {
  const user = await SessionService.getUserFromCookie();
  const selectedSiteID = user?.selectedSiteId;
  const selectedSiteLanguage = user?.selectedSiteLanguage;

  async function getStringKeys(siteID: number) {
    "use server"
    const string_keys = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/get/keys`, {
      method: "POST",
      body: JSON.stringify({ site_id: siteID })
    })
      .then(res => res.json())
    return string_keys;
  }

  async function getStringCatalog(siteID: number, lang_code: string) {
    "use server"

    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/get/content`, {
      method: "POST",
      body: JSON.stringify({ lang_code: lang_code, site_id: siteID })
    })
      .then(res => res.json())
    console.log(result);
    return result;
  }

  const stringKeys = await getStringKeys(Number(selectedSiteID), selectedSiteLanguage?.code ?? "tr");

  const stringCatalog = await getStringCatalog(Number(selectedSiteID), selectedSiteLanguage?.code ?? "tr");

  return (
  <StringCatalogTable 
    stringCatalog={stringCatalog} 
    selectedLanguageInitially={selectedSiteLanguage} 
    stringKeys={stringKeys} 
    getStringKeys={getStringKeys} 
    getStringCatalog={getStringCatalog}
    />)
}

