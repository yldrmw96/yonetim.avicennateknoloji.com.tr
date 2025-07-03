import MessageDetailPageClient from "./client";
import { SessionService } from "@/lib/services/session.service";
export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ message_id: string }>
}) {
  const { message_id } = await params


  const user = await SessionService.getUserFromCookie()
  const siteId = user.selectedSiteId
  const formResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/messages/form/get/by-form", {
    method: "POST",
    body: JSON.stringify({
      siteId: siteId,
      formId: message_id,

    })
  })
  console.log("message_id", message_id)
  const formResponseJson = await formResponse.json()
  console.log("formResponseJson detail", formResponseJson)
  return (
    <MessageDetailPageClient
      message={formResponseJson[0][0]}
    />
  )
}