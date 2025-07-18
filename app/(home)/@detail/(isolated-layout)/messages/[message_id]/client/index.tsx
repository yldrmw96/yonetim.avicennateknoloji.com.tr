"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, Reply, Star, Trash2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { messages } from "@/lib/constants/messages"


// Tarih formatını düzenleyen yardımcı fonksiyon
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

// Gönderenin baş harflerini alan yardımcı fonksiyon
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export default function MessageDetailPageClient({
  message,
}: {
  message: any
}) {



  // Önceki ve sonraki mesaj ID'lerini bul
  const currentIndex = message.form_id
  const prevMessage = currentIndex > 0 ? message[currentIndex - 1] : null
  const nextMessage = currentIndex < message.length - 1 ? message[currentIndex + 1] : null

  return (
    <div className="container mx-auto pt-8">
      <div className="mb-6 flex items-center justify-between px-6">
        <Link
          href="/messages"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Link>
        <div className="flex items-center space-x-2">
          {prevMessage && (
            <Link href={`/messages/${prevMessage.id}`}>
              <Button variant="outline" size="icon" title="Önceki Mesaj">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          {nextMessage && (
            <Link href={`/messages/${nextMessage.id}`}>
              <Button variant="outline" size="icon" title="Sonraki Mesaj">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Card className="overflow-hidden rounded-none px-0 bg-transparent border-none">
        <CardHeader className="px-6 pb-6 !bg-transparent">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">{message.subject}</h1>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" title="Yıldızla">
                  <Star className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Sil">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(message.first_name + " " + message.family_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{message.first_name + " " + message.family_name}</div>
                <div className="text-sm text-muted-foreground">{formatDate(message.submission_created_at)}</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-6 bg-transparent">
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</p>
          </div>
        </CardContent>

        {/* <Separator /> */}

        {/* <CardFooter className=" p-4 px-6"> */}
          {/* <Button className="gap-2">
            <Reply className="h-4 w-4" />
            <span>Yanıtla</span>
          </Button> */}
        {/* </CardFooter> */}
      </Card>
    </div>
  )
}
