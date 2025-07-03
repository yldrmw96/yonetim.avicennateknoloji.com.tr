import { createSlice } from "@reduxjs/toolkit";
import { Site } from "@/types/Site";

const initialState = {
  sites: [] as Site[],
  selectedSite: null as Site | null,
  isLoading: false,
  error: null as string | null,
  shouldRefresh: false,
};

const sitesSlice = createSlice({
  name: "sites",
  initialState,
  reducers: {
    _setSites: (state, action) => {
      state.sites = action.payload;
    },
    _setSelectedSite: (state, action) => {
      state.selectedSite = action.payload;
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

export const { _setSites, _setSelectedSite, _setIsLoading, _setError, _setShouldRefresh } = sitesSlice.actions;
export default sitesSlice.reducer;