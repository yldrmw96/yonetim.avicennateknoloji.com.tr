import Inspector from "@/components/global/inspector";

export default function ContentGroupsInspectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <Inspector.Layout>
      {children}
    </Inspector.Layout>
  )
}