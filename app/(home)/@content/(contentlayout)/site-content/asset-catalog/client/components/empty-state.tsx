import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, Upload } from "lucide-react"

export default function EmptyState() {
  return (
    <div className=" mx-auto py-10">
      

      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FolderOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Varlık Bulunamadı</CardTitle>
          <CardDescription className="text-center">Varlık kataloğunuz şu anda boş.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Resimler, belgeler, videolar ve diğer medya dosyalarını yükleyerek varlık kataloğunuzda yönetin.
          </p>
        </CardContent>
     
      </Card>
    </div>
  )
}
