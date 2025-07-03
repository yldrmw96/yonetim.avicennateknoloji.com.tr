export interface ContentGroup {
  id: number;
  name: string;
  parent_id: number | null;
  children: ContentGroup[];
}