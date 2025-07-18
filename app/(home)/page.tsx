import { Metadata } from "next";
import Client from "@/components/client/dashboard";

export const metadata: Metadata = {
  title: "Ana Sayfa",
  description: "Ana Sayfa",
};

export default function Home() {
  return <Client
    unreadMessages={0}
    totalVisits={0}
    totalUsers={0}
  />
} 