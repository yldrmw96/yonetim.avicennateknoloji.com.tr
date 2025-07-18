import { useSelector } from "react-redux";
import { RootState } from "../index";
import { _setTitle, _setCustomTitle, _setTitleDisplayMode } from "@/store/slices/navigation.slice";
import { store } from "..";
export const useNavigation = () => {
  return {
    selector: useSelector((state: RootState) => state.navigation),
    actions: {
      setTitle: (title: string) => store.dispatch(_setTitle(title)),
      setCustomTitle: (title: string) => store.dispatch(_setCustomTitle(title)),
      setTitleDisplayMode: (titleDisplayMode: boolean) => store.dispatch(_setTitleDisplayMode(titleDisplayMode)),
    }
  }
}

