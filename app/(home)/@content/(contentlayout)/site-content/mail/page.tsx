 
import MailSettingsForm from "./client";
import { SessionService } from "@/lib/services/session.service";

const endPoint = `${process.env.NEXT_PUBLIC_API_URL!}/api/v1/mail/get/by_site`;

export default async function MailSettingsPage() {

  const user = await SessionService.getUserFromCookie();
  const selectedSiteID = Number(user?.selectedSiteId);

  async function getMailSettings(siteID: number) {
    "use server"
    const requestInit = {
      method: "POST",
      body: JSON.stringify({ siteId: siteID }),
    }
    const fetchMailSettings = await fetch(`${endPoint}/${siteID}`, requestInit);
    const mailSettings = await fetchMailSettings.json();


    const resultObj: Record<string, string> = {};

    for (const key of Object.keys(mailSettings)) {
      if (key === "smtpHost") {
        resultObj.mailHost = mailSettings[key] || "";
      }
      if (key === "smtpPort") {
        resultObj.mailPort = mailSettings[key] || "";
      }
      if (key === "smtpUsername") {
        resultObj.mailUsername = mailSettings[key] || "";
      }
      if (key === "smtpPassword") {
        resultObj.mailPassword = mailSettings[key] || "";
      }
    }

    return resultObj;
  }

  const defaultValues = await getMailSettings(Number(selectedSiteID));

  async function updateSelectedSiteId(siteId: number) {
    "use server"
    try {
      const newToken = await SessionService.updateUserSession({ selectedSiteId: siteId.toString() });
      // console.log("newToken", newToken);
      return newToken;
    } catch (error) {
      // console.error(error);
      return null;
    }
  }

  return <MailSettingsForm 
  mailSettings={defaultValues}
  getMailSettings={getMailSettings}
  updateSelectedSiteId={updateSelectedSiteId}
   />;
}
