export interface SeoFormValues {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  metaAuthor: string;
}

export interface FormValueMap {
  seoForm: SeoFormValues;
  // Diğer formlar buraya eklenir
}

export type FormKey = keyof FormValueMap;

export type SingleFormState<T> = {
  values: T;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  error: string | null;
};

export type FormsState = {
  [K in FormKey]?: SingleFormState<FormValueMap[K]>;
};