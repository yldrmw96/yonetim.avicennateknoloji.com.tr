interface Props {
  children: React.ReactNode;
}

export default function InspectorLayout({ children }: Props) {
  return (
    <div id="detail" className="w-full h-full flex flex-col items-center min-h-screen justify-between">
      {children}
    </div>
  )
}