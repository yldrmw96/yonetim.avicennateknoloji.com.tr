import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "" as string,
  customTitle: "" as string,
  titleLastUpdated: null as string | null,
  customTitleLastUpdated: null as string | null,
  isTitleDisplayModeLarge: false,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    _setTitle: (state, action) => {
      state.title = action.payload || "";
      state.titleLastUpdated = new Date().toISOString();
    },
    _setCustomTitle: (state, action) => {
      state.customTitle = action.payload || "";
      state.customTitleLastUpdated = new Date().toISOString();
    },
    _setTitleDisplayMode: (state, action) => {
      state.isTitleDisplayModeLarge = action.payload || false;
    }
  },
});

export const { _setTitle, _setCustomTitle, _setTitleDisplayMode } = navigationSlice.actions;
export default navigationSlice.reducer;