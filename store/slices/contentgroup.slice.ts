import { createSlice } from "@reduxjs/toolkit";
import { ContentGroupType } from "@/types/ContentGroupType";

const initialState = {
  contentGroups: [] as ContentGroupType[],
  selectedContentGroupId: null as number | null,
  isLoading: false,
  error: null as string | null,
  shouldRefresh: false,
};

const contentGroupSlice = createSlice({
  name: "contentGroup",
  initialState,
  reducers: {
    _setContentGroups: (state, action) => {
      state.contentGroups = action.payload;
    },
    _setSelectedContentGroup: (state, action) => {
      state.selectedContentGroupId = action.payload;
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

export const { _setContentGroups, _setSelectedContentGroup, _setIsLoading, _setError, _setShouldRefresh } = contentGroupSlice.actions;
export default contentGroupSlice.reducer;
