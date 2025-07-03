import { ContentUnavailable } from "@/components/global/content-unavailable";
import { Rss } from "lucide-react";

export default function BlogContentUnavailable() {
  return (
    <ContentUnavailable
      title="Blog Yazısı Yok"
      description="Blog yazılarınız burada görüntülenir."
      icon={<Rss />}
    />
  );
} 