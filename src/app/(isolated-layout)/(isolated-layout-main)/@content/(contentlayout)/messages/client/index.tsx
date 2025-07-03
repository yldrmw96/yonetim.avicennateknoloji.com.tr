
import { SessionService } from "@/lib/services/session.service";
import { MessageList } from "./components";
import { Button } from "@/components/ui/button";

export default async function MessagesClient() {
  const user = await SessionService.getUserFromCookie();
  const forms = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/messages/form/get/all", {
    method: "POST",
    body: JSON.stringify({
      siteId: user.selectedSiteId
    })
  })
  const formsJson = await forms.json();
  const data = formsJson[0]
  console.log(formsJson)
  return (
    <MessageList>
      <>
      <div className="w-full gap-x-2 grid grid-cols-3 items-center px-6 py-2">
          <Button variant="default" className="w-full text-xs py-2">
            Tümü
          </Button>
        <Button variant="outline" className="w-full text-xs text-xs ">
          Formlar
        </Button>
        <Button variant="outline" className="w-full text-xs py-2">
        
          Mesajlar
        </Button>
      </div>
     <div className="flex flex-col border-t">
          {data.map((message) => (
            <MessageList.Item
              key={message.form_id}
              data={{
                id: message.form_id,
                senderName: message.first_name + " " + message.family_name,
                date: message.submission_created_at,
                subject: message.subject,
                body: message.content
              }}
            />
          ))}
     </div>
      </>

    </MessageList>
  )
}
