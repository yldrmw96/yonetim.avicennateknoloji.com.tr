function BlogComponent() {
  return (
    null
  )
}
import BlogItemSkeleton from "./skeleton";

const Blog = Object.assign(BlogComponent, {
  Skeleton: BlogItemSkeleton
});

Blog.Skeleton = BlogItemSkeleton;



export default Blog;