import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/types/User";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null ,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    _setUser: (state, action) => {
      state.user = action.payload;
    },
    _setToken: (state, action) => {
      state.token = action.payload;
    },
    _setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    _setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    _setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export  const { _setUser, _setToken, _setIsAuthenticated, _setIsLoading, _setError } = authSlice.actions;
export default authSlice.reducer;