import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const formValidatingSlice = createSlice({
  name: "formValidating",
  initialState: {
    isLoading: true,
    mail: { isValidating: false, isDirty: false, isSubmitting: false, data: null },
    seo: { isValidating: false, isDirty: false, isSubmitting: false, data: null },
    user: { isValidating: false, isDirty: false, isSubmitting: false, data: null },
    password: { isValidating: false, isDirty: false, isSubmitting: false, data: null },
  },
  reducers: {
    _setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    _setIsMailFormValidating: (state, action) => {
      state.mail.isValidating = action.payload;
    },
    _setIsSeoFormValidating: (state, action) => {
      state.seo.isValidating = action.payload;
    },
    _setIsUserFormValidating: (state, action) => {
      state.user.isValidating = action.payload;
    },
    _setIsPasswordFormValidating: (state, action) => {
      state.password.isValidating = action.payload;
    },
    _setIsDirty: (state, action) => {
      state.mail.isDirty = action.payload;
    },
    _setIsDirtySeo: (state, action) => {
      state.seo.isDirty = action.payload;
    },
    _setIsDirtyUser: (state, action) => {
      state.user.isDirty = action.payload;
    },
    _setIsData: (state, action) => {
      state.mail.data = action.payload;
    },
    _setIsDataSeo: (state, action) => {
      state.seo.data = action.payload;
    },
    _setIsDataUser: (state, action) => {
      state.user.data = action.payload;
    },
    _setIsDataPassword: (state, action) => {
      state.password.data = action.payload;
    },
    _setIsDirtyMail: (state, action) => {
      state.mail.isDirty = action.payload;
    },
    _setIsDataMail: (state, action) => {
      state.mail.data = action.payload;
    },
    _setIsDirtyPassword: (state, action) => {
      state.password.isDirty = action.payload;
    },
    _setIsSubmittingMail: (state, action) => {
      state.mail.isSubmitting = action.payload;
    },
    _setIsSubmittingSeo: (state, action) => {
      state.seo.isSubmitting = action.payload;
    },
    _setIsSubmittingUser: (state, action) => {
      state.user.isSubmitting = action.payload;
    },
    _setIsSubmittingPassword: (state, action) => {
      state.password.isSubmitting = action.payload;
    },

    _resetFormValidating: (state) => {
      state.mail.isValidating = false;
      state.seo.isValidating = false;
      state.user.isValidating = false;
      state.password.isValidating = false;
      state.isLoading = true;
    },

  },
});

export const {
  _setIsMailFormValidating,
  _setIsSeoFormValidating,
  _setIsUserFormValidating,
  _setIsPasswordFormValidating,
  _resetFormValidating, _setIsDirty, _setIsData, _setIsDirtySeo, _setIsDataSeo,
  _setIsDirtyUser, _setIsDataUser,
  _setIsDirtyPassword,
  _setIsDataPassword,
  _setIsDirtyMail,
  _setIsDataMail,
  _setIsSubmittingMail,
  _setIsSubmittingSeo,
  _setIsSubmittingUser,
  _setIsSubmittingPassword,
  _setIsLoading
} = formValidatingSlice.actions;

export default formValidatingSlice.reducer;