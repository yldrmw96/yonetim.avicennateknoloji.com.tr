import { configureStore } from '@reduxjs/toolkit'
import userModalSlice from '@/store/slices/user-modal-slice';
import  authSlice from '@/store/slices/auth.slice';
import sitesSlice from '@/store/slices/sites.slice';
import assetsSlice from '@/store/slices/assets.slice';
import localizationCatalogSlice from '@/store/slices/localizationcatalog.slice';
import contentGroupSlice from '@/store/slices/contentgroup.slice';
import formValidatingSlice from '@/store/slices/formvalidating.slice';
import postsSlice from '@/store/slices/posts.slice';
import navigationSlice from './slices/navigation.slice';
import storage from 'redux-persist/lib/storage'; // localStorage
import { persistReducer } from 'redux-persist';
// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['counter'], // hangi slice'ları persist etmek istiyorsan onları yaz
// };

export const store = configureStore({
  reducer: {
    userModal: userModalSlice,
    auth: authSlice,
    sites: sitesSlice,
    assets: assetsSlice,
    localizationCatalog: localizationCatalogSlice,
    contentGroup: contentGroupSlice,
    formValidating: formValidatingSlice,
    posts: postsSlice,  
    navigation: navigationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;