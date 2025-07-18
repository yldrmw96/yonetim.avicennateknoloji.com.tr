import { useSelector } from "react-redux";
import { RootState, store } from "..";
import { Site } from "@/types/Site";
import { _setSites, _setSelectedSite, _setIsLoading, _setError, _setShouldRefresh } from "../slices/sites.slice";

export const useSites = () => {
  return {
    selector: useSelector((state: RootState) => state.sites),
    actions: {
      setSites: (sites: Site[]) => {
        store.dispatch(_setSites(sites));
      },
      setSelectedSite: (site: Site) => {
        store.dispatch(_setSelectedSite(site));
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