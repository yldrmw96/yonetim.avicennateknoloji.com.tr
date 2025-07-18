
import EditBlogPostPage from "./client";

export default async function BlogPostPage({ params }: { params: { post_id: string } }) {
  async function getPost({ post_id }: { post_id: string }): Promise<any> {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/blog/get/post-id", {
      method: "POST",
      body: JSON.stringify({ postId: post_id }),
    });
    const data = await response.json();
    return data;
  }

  const post = await getPost({ post_id: params.post_id });

 
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <EditBlogPostPage postFromServer={post} />

  );
}