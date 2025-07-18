import { useSelector } from "react-redux";
import { RootState, store } from "..";
import { _setIsMailFormValidating, _setIsSeoFormValidating, _setIsSubmittingMail, _setIsSubmittingSeo, _setIsSubmittingUser, _setIsSubmittingPassword, _setIsUserFormValidating, _setIsLoading } from "../slices/formvalidating.slice";
import { _setIsPasswordFormValidating, _resetFormValidating } from "../slices/formvalidating.slice";
import { _setIsDirty, _setIsData } from "../slices/formvalidating.slice";
import { _setIsDirtySeo, _setIsDataSeo } from "../slices/formvalidating.slice";
import { _setIsDirtyUser, _setIsDataUser } from "../slices/formvalidating.slice";
import { _setIsDirtyPassword, _setIsDataPassword } from "../slices/formvalidating.slice";
export const useFormValidating = () => {
  return {
    selector: useSelector((state: RootState) => state.formValidating),
    actions: {
      setIsMailFormValidating: (isMailFormValidating: boolean) => {
        store.dispatch(_setIsMailFormValidating(isMailFormValidating));
      },
      setIsSeoFormValidating: (isSeoFormValidating: boolean) => {
        store.dispatch(_setIsSeoFormValidating(isSeoFormValidating));
      },
      setIsUserFormValidating: (isUserFormValidating: boolean) => {
        store.dispatch(_setIsUserFormValidating(isUserFormValidating));
      },  
      setIsPasswordFormValidating: (isPasswordFormValidating: boolean) => {
        store.dispatch(_setIsPasswordFormValidating(isPasswordFormValidating));
      },
      resetFormValidating: () => {
        store.dispatch(_resetFormValidating());
      },
      setIsDirty: (isDirty: boolean) => {
        store.dispatch(_setIsDirty(isDirty));
      },
      setIsData: (data: any) => {
        store.dispatch(_setIsData(data));
      },
      setIsDirtySeo: (isDirty: boolean) => {
        store.dispatch(_setIsDirtySeo(isDirty));
      },
      setIsDataSeo: (data: any) => {
        store.dispatch(_setIsDataSeo(data));
      },
      setIsDirtyUser: (isDirty: boolean) => {
        store.dispatch(_setIsDirtyUser(isDirty));
      },
      setIsDataUser: (data: any) => {
        store.dispatch(_setIsDataUser(data));
      },
      setIsDirtyPassword: (isDirty: boolean) => {
        store.dispatch(_setIsDirtyPassword(isDirty));
      },
      setIsDataPassword: (data: any) => {
        store.dispatch(_setIsDataPassword(data));
      },
      setIsSubmittingMail: (isSubmitting: boolean) => {
        store.dispatch(_setIsSubmittingMail(isSubmitting));
      },
      setIsSubmittingSeo: (isSubmitting: boolean) => {
        store.dispatch(_setIsSubmittingSeo(isSubmitting));
      },
      setIsSubmittingUser: (isSubmitting: boolean) => {
        store.dispatch(_setIsSubmittingUser(isSubmitting));
      },
      setIsSubmittingPassword: (isSubmitting: boolean) => {
        store.dispatch(_setIsSubmittingPassword(isSubmitting));
      },
      setIsLoading: (isLoading: boolean) => {
        store.dispatch(_setIsLoading(isLoading));
      },
    }
  }
}