import { Metadata } from "next";
import Client from "./client";
import { redirect } from "next/navigation";
import { SessionService } from "@/lib/services/session.service";

export const metadata: Metadata = {
  title: "Blog | " + process.env.NEXT_PUBLIC_SITE_NAME,
  description: "Blog | " + process.env.NEXT_PUBLIC_SITE_NAME,
};

export default async function BlogPage() {
  const user = await SessionService.getUserFromCookie();
  if (!user) {
    redirect("/login");
  }
  async function getPosts({ site_id }: { site_id: number }) {
    "use server"
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/blog/get/by-site", {
      method: "POST",
      body: JSON.stringify({ siteId: site_id }),
    });
    const data = await response.json();
    return data;
  }


  async function getTags({ site_id }: { site_id: number }) {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/tags/get/by-site", {
      method: "POST",
      body: JSON.stringify({ siteId: site_id }),
    });
    const data = await response.json();
    return data;
  }
  const data = await getPosts({ site_id: user.selectedSiteId });
  const tags = await getTags({ site_id: user.selectedSiteId });
  // console.warn("tags: ", tags);
  return (
    <Client postsFromServer={data} tagsFromServer={tags} getPostsFn={getPosts} />
  );
}