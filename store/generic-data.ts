import { createSlice, PayloadAction, Draft } from '@reduxjs/toolkit';
import { RootState, store } from '.';
import { useSelector } from 'react-redux';

export interface GenericDataState<T> {
  data: T[] | null;
  isLoading: boolean;
  error: string | null;
  shouldRefresh: boolean;
  selectedItem: T | null;
}

export const createGenericSlice = <T extends Record<string, any>>(name: string, initialState?: Partial<GenericDataState<T>>) => {
  return createSlice({
    name,
    initialState: {
      data: null,
      isLoading: false,
      error: null,
      shouldRefresh: false,
      selectedItem: null,
      ...initialState
    } as GenericDataState<T>,
    reducers: {
      setData: (state, action: PayloadAction<Draft<T>[]>) => {
        state.data = action.payload;
      },
      setSelectedItem: (state, action: PayloadAction<Draft<T> | null>) => {
        state.selectedItem = action.payload;
      },
      setIsLoading: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
      },
      setError: (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      },
      setShouldRefresh: (state, action: PayloadAction<boolean>) => {
        state.shouldRefresh = action.payload;
      },
      reset: (state) => {
        state.data = null;
        state.selectedItem = null;
        state.isLoading = false;
        state.error = null;
        state.shouldRefresh = false;
      }
    }
  });
};

export const createGenericHook = <T extends Record<string, any>>(
  sliceName: keyof RootState,
  actions: any
) => {
  return () => {
    return {
      selector: useSelector((state: RootState) => {
        const slice = state[sliceName];
        if (!slice || typeof slice !== 'object') {
          throw new Error(`Slice ${String(sliceName)} not found in store`);
        }
        return slice as unknown as GenericDataState<T>;
      }),
      actions: {
        setData: (data: T[]) => {
          store.dispatch(actions.setData(data));
        },
        setSelectedItem: (item: T | null) => {
          store.dispatch(actions.setSelectedItem(item));
        },
        setIsLoading: (isLoading: boolean) => {
          store.dispatch(actions.setIsLoading(isLoading));
        },
        setError: (error: string | null) => {
          store.dispatch(actions.setError(error));
        },
        setShouldRefresh: (shouldRefresh: boolean) => {
          store.dispatch(actions.setShouldRefresh(shouldRefresh));
        },
        reset: () => {
          store.dispatch(actions.reset());
        }
      }
    };
  };
};
