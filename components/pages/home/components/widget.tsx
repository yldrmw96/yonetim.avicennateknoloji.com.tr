import { cn } from "@/lib/utils"; 

export default function WidgetItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* <WidgetResizingHandle position="left" />
      <WidgetResizingHandle position="right" />
      <WidgetResizingHandle position="top" />
      <WidgetResizingHandle position="bottom" /> */}
      {children}
    </div>
  )
}

const WIDGET_RESIZING_HANDLE_THICKNESS = "0.6rem";
const WIDGET_RESIZING_HANDLE_HEIGHT = "2rem";

const WIDGET_DEFAULT_CLASSNAME = "absolute z-1 bg-gray-300 rounded-3xl";
const WIDGET_INLINE_CLASSNAME =
  `h-[${WIDGET_RESIZING_HANDLE_HEIGHT}] w-[${WIDGET_RESIZING_HANDLE_THICKNESS}] translate-x-[50%] top-1/2 -translate-y-1/2 `;
const WIDGET_INLINE_CLASSNAME_BLOCK =
  `left-1/2 translate-y-[50%] translate-x-[-50%] h-[${WIDGET_RESIZING_HANDLE_THICKNESS}] w-[${WIDGET_RESIZING_HANDLE_THICKNESS}]`;
enum WidgetResizingHandlePosition {
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom",
}

function WidgetResizingHandle({ position }: { position: WidgetResizingHandlePosition }) {
  return (
    <div
      className={cn(
        WIDGET_DEFAULT_CLASSNAME,
        position === "left" &&
        "left-0" + WIDGET_INLINE_CLASSNAME,
        position === "right" &&
        "right-0 " + WIDGET_INLINE_CLASSNAME,
        position === "top" &&
        "top-0 " + WIDGET_INLINE_CLASSNAME_BLOCK,
        position === "bottom" &&
        "bottom-0 " + WIDGET_INLINE_CLASSNAME_BLOCK,
        position === "left" && "cursor-w-resize",
        position === "right" && "cursor-e-resize",
        position === "top" && "cursor-n-resize",
        position === "bottom" && "cursor-s-resize"
      )}
    ></div>
  );
}