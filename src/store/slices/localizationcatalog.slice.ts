import { createSlice } from "@reduxjs/toolkit";
import { LocalizationCatalogItem } from "@/types/LocalizationCatalogItem";
import { Language } from "@/types/Language";

const initialState = {
  languages: [] as Language[],
  selectedLanguage: null as Language | null,
  localizationCatalog: [] as LocalizationCatalogItem[],
  selectedLocalizationCatalogItem: null as LocalizationCatalogItem | null,
  isLoading: false,
  error: null as string | null,
  shouldRefresh: false,
};

const localizationCatalogSlice = createSlice({
  name: "localizationCatalog",
  initialState,
  reducers: {
    _setLanguages: (state, action) => {
      state.languages = action.payload;
    },
    _setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    _setLocalizationCatalog: (state, action) => {
      state.localizationCatalog = action.payload;
    },
    _setSelectedLocalizationCatalogItem: (state, action) => {
      state.selectedLocalizationCatalogItem = action.payload;
    },
    _setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    _setError: (state, action) => {
      state.error = action.payload;
    },
    _setShouldRefresh: (state, action) => { 
      state.shouldRefresh = action.payload;
    },
  },
}); 
export const { _setLanguages, _setSelectedLanguage, _setLocalizationCatalog, _setSelectedLocalizationCatalogItem, _setIsLoading, _setError, _setShouldRefresh } = localizationCatalogSlice.actions;
export default localizationCatalogSlice.reducer;  