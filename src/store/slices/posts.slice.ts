import { createGenericSlice } from '../generic-data';
import { Post } from '@/lib/types/api.types';

const postsSlice = createGenericSlice<Post>('posts');

export const { 
  setData: setPosts,
  setSelectedItem: setSelectedPost,
  setIsLoading,
  setError,
  setShouldRefresh,
  reset
} = postsSlice.actions;

export default postsSlice.reducer;