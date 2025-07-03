export interface AnyRouteItem {
  name: string;
  type: "group" | "route";
}


export interface Route extends AnyRouteItem {
  id: string;
  href: string;
  icon: () => React.ReactNode;
  children: Route[];
  segment: string;
}
export interface RouteGroup extends AnyRouteItem {
  id: string;
}