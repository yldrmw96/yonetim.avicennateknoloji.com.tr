import { createGenericSlice } from '../generic-data';
import { AssetItem } from '@/lib/types/AssetItem';

const assetsSlice = createGenericSlice<AssetItem>('assets');

export const {
  setData: setAssets,
  setSelectedItem: setSelectedAsset,
  setIsLoading,
  setError,
  setShouldRefresh,
  reset
} = assetsSlice.actions;

export default assetsSlice.reducer;