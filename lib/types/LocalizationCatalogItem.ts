export type LocalizationCatalogItem = {
  id: string;
  key: string;
  group_id: number;
  localizations: Record<string, LocalizationContent>;
};


export type LocalizationContent = {
  state: string;
  value: string;
};