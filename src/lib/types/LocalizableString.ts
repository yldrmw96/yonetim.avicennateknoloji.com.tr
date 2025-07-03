// LocalizableStringRow is a row in the localization table
// Localization is a localization of a string. localizations type is should be Map<string, string>


export type LocalizableStringRow = {
  id: string;
  key: string;
  group_id: number;
  localizations: Record<string, LocalizationContent>;
};


export type LocalizationContent = {
  state: string;
  value: string;
};