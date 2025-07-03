import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TabsOptions {
  showBottomBar?: boolean;
  showIndicator?: boolean;
}

export const TabsOptionsDefault: TabsOptions = {
  showBottomBar: false,
  showIndicator: false,
}

export const TabsContext = createContext<{
  activeTabId: string;
  setActiveTabId: (id: string) => void;
}>({
  activeTabId: "",
  setActiveTabId: () => { },
});

export function TabsProvider({ children, initialTabId }: { children: React.ReactNode, initialTabId: string }) {
  const [activeTabId, setActiveTabId] = useState<string>(initialTabId);

  return (
    <TabsContext.Provider value={{ activeTabId, setActiveTabId }}>{children}</TabsContext.Provider>
  )
}



export function TabsContent({ tabs, options = TabsOptionsDefault }: { tabs: { id: string, label: string, icon?: React.ReactNode, content: React.ReactNode }[], options?: TabsOptions }) {
  const { activeTabId, setActiveTabId } = useContext(TabsContext);

  function shouldPrevTab() {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId);
    return currentIndex > 0;
  }

  function shouldNextTab() {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId);
    return currentIndex < tabs.length - 1;
  }

  const gridClass = () => {
    if (options?.showBottomBar) {
      return "grid grid-rows-[auto_1fr_auto]";
    }
    if (options?.showIndicator) {
      return "grid grid-rows-[1fr]";
    }
    return "grid grid-rows-[1fr]";
  }

  return (
    <div className={gridClass()} >
      {
        options?.showIndicator && (
          <div className="flex items-center justify-start gap-2 px-2 py-2">
            <Button disabled={!shouldPrevTab()} variant="outline" size="icon" className="" onClick={() => setActiveTabId(tabs[0].id)}>
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button disabled={!shouldNextTab()} variant="outline" size="icon" className="" onClick={() => setActiveTabId(tabs[tabs.length - 1].id)}>
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        )
      }
      {
        tabs.map((tab) => (
          activeTabId === tab.id && tab.content
        ))
      }
      {
        options?.showBottomBar && (
          <div className="!grid auto-cols-fr border-t gap-2 grid-flow-col items-center justify-around py-3 ">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTabId(tab.id)} className={cn("text-sm font-medium flex flex-col justify-center items-center gap-2", activeTabId === tab.id ? "text-primary" : "opacity-50")}>{tab.icon || <TabIconFallback />}
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>)}
    </div >
  )
}

export function Tabs({ tabs, options = TabsOptionsDefault }: { tabs: { id: string, label: string, icon?: React.ReactNode, content: React.ReactNode }[], options?: TabsOptions }) {
  if (tabs.length === 0) throw new Error("Tabs must have at least one tab");
  return (
    <TabsProvider initialTabId={tabs[0].id}>
      <TabsContent tabs={tabs} options={options} />
    </TabsProvider>
  )
}

const TabIconFallback = ({ className, ...props }: { className?: string, props?: React.SVGProps<SVGSVGElement> }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className={cn("bi bi-star-fill", className)}  viewBox="0 0 16 16" {...props}>
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>
  )
}