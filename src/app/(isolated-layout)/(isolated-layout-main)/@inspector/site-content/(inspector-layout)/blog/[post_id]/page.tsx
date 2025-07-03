import { Metadata } from "next";
import BlogInspectorClient from "./client";

export const metadata: Metadata = {
  title: "Blog | " + process.env.NEXT_PUBLIC_SITE_NAME,
  description: "Blog | " + process.env.NEXT_PUBLIC_SITE_NAME,
};

export default async function BlogPage({ params }: { params: { post_id: string } }) {

  async function getTags({ post_id }: { post_id: number }) {
    "use server"
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/tags/get/by-post", {
      method: "POST",
      body: JSON.stringify({ postId: post_id }),
    });
    const data = await response.json();
    return data;
  }
  async function getPost({ post_id }: { post_id: number }) {
    "use server"
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/blog/get/post-id", {
      method: "POST",
      body: JSON.stringify({ postId: post_id }),
    });
    const data = await response.json();
    return data;
  }

  async function addTagAndBindToPost({ title, slug, postId }: { title: string, slug: string, postId: number }) {
    "use server"
    console.log(title, slug, postId)
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/tags/add/to-post", {
      method: "POST",
      body: JSON.stringify({ title: title, slug: slug, postId: postId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  }

  async function removeTagFromPost({ tagId, postId }: { tagId: number, postId: number }) {
    "use server"
    console.log(tagId, postId)
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/tags/remove/from-post", {
      method: "POST",
      body: JSON.stringify({ tagId: tagId, postId: postId }),
    });
    const data = await response.json();
    return data;
  }

  const post = await getPost({ post_id: parseInt(params.post_id) });
  const tags = await getTags({ post_id: parseInt(params.post_id) });
  console.log(post);
  console.log(tags);
  return (
    <BlogInspectorClient postFromServer={post} tagsFromServer={tags} addTagAndBindToPost={addTagAndBindToPost} removeTagFromPost={removeTagFromPost} />
  );
}