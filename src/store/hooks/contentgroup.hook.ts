import { useSelector } from "react-redux";
import { RootState, store } from "..";
import { _setContentGroups, _setError, _setIsLoading, _setSelectedContentGroup, _setShouldRefresh } from "../slices/contentgroup.slice";
import { ContentGroupType } from "@/lib/types/ContentGroupType";

export const useContentGroup = () => {
  return {
    selector: useSelector((state: RootState) => state.contentGroup),
    actions: {
      setContentGroups: (contentGroups: ContentGroupType[]) => {
        store.dispatch(_setContentGroups(contentGroups));
      },
      setSelectedContentGroup: (contentGroup: ContentGroupType) => {
        store.dispatch(_setSelectedContentGroup(contentGroup));
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