import { useSelector } from "react-redux";
import { RootState, store } from "..";
import { Language } from "@/lib/types";
import { _setLanguages, _setSelectedLanguage, _setLocalizationCatalog, _setSelectedLocalizationCatalogItem, _setIsLoading, _setError, _setShouldRefresh } from "../slices/localizationcatalog.slice";
import { LocalizationCatalogItem } from "@/lib/types";

export const useLocalizationCatalog = () => {
  return {
    selector: useSelector((state: RootState) => state.localizationCatalog),
    actions: {
      setLanguages: (languages: Language[]) => {
        store.dispatch(_setLanguages(languages));
      },
      setSelectedLanguage: (language: Language) => {
        store.dispatch(_setSelectedLanguage(language));
      },
      setLocalizationCatalog: (localizationCatalog: LocalizationCatalogItem[]) => {
        store.dispatch(_setLocalizationCatalog(localizationCatalog));
      },  
      setSelectedLocalizationCatalogItem: (localizationCatalogItem: LocalizationCatalogItem) => {
        store.dispatch(_setSelectedLocalizationCatalogItem(localizationCatalogItem));
      },
      setIsLoading: (isLoading: boolean) => {
        store.dispatch(_setIsLoading(isLoading));
      },    
      setError: (error: string) => {
        store.dispatch(_setError(error));
      },
      setShouldRefresh: (shouldRefresh: boolean) => {
        store.dispatch(_setShouldRefresh(shouldRefresh));
      },
    }
  }
}