import { createGenericHook } from '../generic-data';
import { Post } from '@/lib/types/api.types';
import * as postsActions from '../slices/posts.slice';

export const usePosts = createGenericHook<Post>('posts', postsActions);
