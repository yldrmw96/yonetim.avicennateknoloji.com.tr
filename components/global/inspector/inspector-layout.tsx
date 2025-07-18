export default function InspectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="[--sidebar-width:15rem] w-[var(--sidebar-width)] flex flex-col gap-4 border-l bg-gray-50/90 dark:bg-input/30 min-w-[var(--sidebar-width)]  max-w-[var(--sidebar-width)] shadow-[inset_21px_0px_4px_-20px_#ffffff] dark:shadow-[inset_21px_0px_4px_-20px_var(--color-neutral-800)]"
    >
      {children}
    </div>
  )
}