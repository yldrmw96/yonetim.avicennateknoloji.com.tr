import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  isOpen: false,
};

 const userModalSlice = createSlice({
  name: "userModal",
  initialState,
  reducers: {
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },  
});

export const { setIsOpen } = userModalSlice.actions

export default userModalSlice.reducer;
