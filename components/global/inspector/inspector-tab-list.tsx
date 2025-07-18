export default function InspectorTabList({ children }: { children: React.ReactNode }) {
  return (

      <div className="border-b grid grid-cols-auto grid-rows-[1fr]">
        {children}
      </div>

  )
}