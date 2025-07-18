import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus } from "lucide-react"

export default function BlogManagementPage() {
  return (
    <div className=" mx-auto py-10">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-col items-center">
          <div className="dark:bg-zinc-900 border border-dashed flex h-12 items-center justify-center mb-4 rounded-2xl w-12">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardDescription className="text-center">Blogunuz şu anda boş.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-xs  text-muted-foreground text-center max-w-md" style={{
            textWrap: "balance",
            fontOpticalSizing: "none",
            fontFeatureSettings: "normal"
          }}>
            Kitlenizle içerik paylaşmak için blog yazıları oluşturun ve yayınlayın. Tüm blog içeriğinizi burada taslak
            halinde hazırlayabilir, zamanlayabilir ve yönetebilirsiniz.
          </p>
        </CardContent>

      </Card>
    </div>
  )
}
