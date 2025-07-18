export function MessageList({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col border-b border-t w-full">
      {children}
    </div>
  )
}