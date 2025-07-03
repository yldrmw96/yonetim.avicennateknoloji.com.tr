"use client"

import { ActivityIndicator } from "@/components/global/activity-indicator";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  handleLogout?: () => void | Promise<void>
}

export default function NoWebsiteClient({ handleLogout = () => { } }: Props) {
  const router = useRouter()

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-none shadow-none gap-3">
          <CardHeader className="mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-exclamation-triangle mb-6 mx-auto text-4xl text-amber-500" viewBox="0 0 16 16">
              <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
              <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
            </svg>
            <CardTitle className="text-center text-2xl font-semibold">Aktif Bir Web Siteniz Bulunmamaktadır</CardTitle>
            <CardDescription className="text-center text-base font-medium">Şu anda sistemde aktif bir web siteniz görünmüyor. Bu, sitenizin süresinin dolmuş olabileceği
              veya henüz bir web sitesi tanımlanmadığı anlamına gelebilir.</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm font-medium">
            <p>Detaylı bilgi almak veya yeni bir web sitesi satın almak için lütfen bizimle iletişime geçin.</p>
          </CardContent>


          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full !font-bold !text-base" >İletişime Geç</Button>
            <Button disabled={false} variant="outline" className="w-full !font-bold !text-base bg-gray-100 hover:bg-gray-200" onClick={async () => {
              await handleLogout()
              router.refresh()
            }}>
              {false ? <ActivityIndicator /> : "Çıkış Yap"}
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  )
}