import { getTokenExpirationStatus } from "@/lib/utils/cyrpto";
import LocalizationTopbar from "./client";
import { cookies } from "next/headers";

export default async function StringCatalogTopbar() {
  async function fetchSupportedLanguages() {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/languages/get/all-supported-languages`)
    const data = await response.json()
    return data;
  }

  const supportedLanguages = await fetchSupportedLanguages();

  async function getSessionCookie() {
    const c = await cookies();
    const sessionCookie = c.get("SESSION_ID");
    return sessionCookie;
  }
  const sessionCookie = await getSessionCookie();
  const status = getTokenExpirationStatus(sessionCookie?.value || "");

  if (status.isExpired) {
    // console.log(`Token süresi ${status.readable} önce dolmuş.`);
  } else {
    // console.log(`Token hala geçerli. Süre sonuna ${status.readable} kaldı.`);
  }
  return (
    <LocalizationTopbar supportedLanguages={supportedLanguages} />
  )
}
