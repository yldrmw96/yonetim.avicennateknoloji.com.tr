import { createGenericHook } from '../generic-data';
import { AssetItem } from '@/lib/types/AssetItem';
import * as assetsActions from '../slices/assets.slice';

export const useAssets = createGenericHook<AssetItem>('assets', assetsActions);
