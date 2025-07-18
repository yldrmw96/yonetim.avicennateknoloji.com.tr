import { useSelector } from "react-redux";
import { RootState, store } from "..";
import { User } from "@/lib/types/user.types";
import { _setUser, _setToken, _setIsAuthenticated, _setIsLoading, _setError } from "@/store/slices/auth.slice";

export const useAuth = () => {
  return {
    selector: useSelector((state: RootState) => state.auth),
    actions: {
      setUser: (user: User) => {
        store.dispatch(_setUser(user));
        store.dispatch(_setIsAuthenticated(true));
      },
      setToken: (token: string) => {
        store.dispatch(_setToken(token));
        store.dispatch(_setIsAuthenticated(true));
      },
      setIsAuthenticated: (isAuthenticated: boolean) => {
        store.dispatch(_setIsAuthenticated(isAuthenticated));
      },
      setIsLoading: (isLoading: boolean) => {
        store.dispatch(_setIsLoading(isLoading));
      },
      setError: (error: string | null) => {
        store.dispatch(_setIsLoading(false));
        store.dispatch(_setError(error));
      },
      logout: () => {
        store.dispatch(_setUser(null));
        store.dispatch(_setToken(null));
        store.dispatch(_setIsAuthenticated(false));
      },
      login: (user: User, token: string) => {
        store.dispatch(_setUser(user));
        store.dispatch(_setToken(token));
        store.dispatch(_setIsAuthenticated(true));
      },
    },
  }
}