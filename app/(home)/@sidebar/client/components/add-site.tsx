import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/global/tabs";
import { useState } from "react";
import { useContext } from "react";
import { TabsContext } from "@/components/global/tabs";

const TabsData = [
  {
    id: "1",
    label: "Site Ekle", content: <AddSiteModalNameStep />
  },
  { id: "2", label: "Dize Kataloğu", content: <div className="p-4">Dize Kataloğu</div> },
  { id: "3", label: "Renk Şeması", content: <div className="p-4">Renk Şeması</div> },
]

export function AddSiteModal({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-[28rem] p-0">
        <Tabs tabs={TabsData} />
      </DialogContent>
    </Dialog>
  )
}
const TabIconFallback = () => {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
  </svg>)
}

const AddSiteModalIcon = () => {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" fill="currentColor" height="1em" viewBox="0 0 56 56">
    <path d="M 44.7242 49.2514 L 51.3650 49.2514 C 54.4401 49.2514 56 47.7807 56 44.8615 L 56 12.4603 C 56 9.5411 54.4401 8.0480 51.3650 8.0480 L 44.7242 8.0480 C 41.6715 8.0480 40.0892 9.5411 40.0892 12.4603 L 40.0892 44.8615 C 40.0892 47.7807 41.6715 49.2514 44.7242 49.2514 Z M 24.6686 49.2514 L 31.3093 49.2514 C 34.3845 49.2514 35.9667 47.7807 35.9667 44.8615 L 35.9667 18.9673 C 35.9667 16.0480 34.3845 14.5550 31.3093 14.5550 L 24.6686 14.5550 C 21.6157 14.5550 20.0558 16.0480 20.0558 18.9673 L 20.0558 44.8615 C 20.0558 47.7807 21.6157 49.2514 24.6686 49.2514 Z M 4.6351 49.2514 L 11.2758 49.2514 C 14.3510 49.2514 15.9109 47.7807 15.9109 44.8615 L 15.9109 25.4520 C 15.9109 22.5327 14.3510 21.0397 11.2758 21.0397 L 4.6351 21.0397 C 1.5822 21.0397 0 22.5327 0 25.4520 L 0 44.8615 C 0 47.7807 1.5822 49.2514 4.6351 49.2514 Z" />
  </svg>)
}


function AddSiteModalNameStep() {
  const { setActiveTabId } = useContext(TabsContext);
  const [siteName, setSiteName] = useState("");
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center text-4xl text-primary mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" fill="currentColor" height="1em" viewBox="0 0 56 56">
            <path d="M 44.7242 49.2514 L 51.3650 49.2514 C 54.4401 49.2514 56 47.7807 56 44.8615 L 56 12.4603 C 56 9.5411 54.4401 8.0480 51.3650 8.0480 L 44.7242 8.0480 C 41.6715 8.0480 40.0892 9.5411 40.0892 12.4603 L 40.0892 44.8615 C 40.0892 47.7807 41.6715 49.2514 44.7242 49.2514 Z M 24.6686 49.2514 L 31.3093 49.2514 C 34.3845 49.2514 35.9667 47.7807 35.9667 44.8615 L 35.9667 18.9673 C 35.9667 16.0480 34.3845 14.5550 31.3093 14.5550 L 24.6686 14.5550 C 21.6157 14.5550 20.0558 16.0480 20.0558 18.9673 L 20.0558 44.8615 C 20.0558 47.7807 21.6157 49.2514 24.6686 49.2514 Z M 4.6351 49.2514 L 11.2758 49.2514 C 14.3510 49.2514 15.9109 47.7807 15.9109 44.8615 L 15.9109 25.4520 C 15.9109 22.5327 14.3510 21.0397 11.2758 21.0397 L 4.6351 21.0397 C 1.5822 21.0397 0 22.5327 0 25.4520 L 0 44.8615 C 0 47.7807 1.5822 49.2514 4.6351 49.2514 Z" />
          </svg>
        </div>
        <h2 className="leading-none text-2xl font-bold text-center">Site Ekle</h2>
        <div className="text-muted-foreground text-sm">
          Lütfen yeni site bilgilerini giriniz.
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Input type="text"
          placeholder="Site Adı"
          containerClassName="w-[14rem] mx-auto [&_input]:text-center border-gray-300 font-medium" className="text-center font-semibold"
        />
        <Button className="max-w-fit mx-auto px-4 font-medium" onClick={() => setActiveTabId("2")}>Devam Et</Button>
      </div>
    </div>
  )
}
