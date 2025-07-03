"use client";

import { SectionWrapper } from "@/components/section-wrapper";
import { StatCard } from "@/app/(isolated-layout)/(isolated-layout-main)/@content/(contentlayout)/dashboard/client/components/stat-card";
import { Person3, CursorRays, EnvelopeBadge } from "framework7-icons/react";

import { useSites } from "@/store/hooks/sites.hook";
import WidgetItem from "./components/widget";
import ClientProps from "./client-props";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Client({
  unreadMessages,
  totalVisits,
  totalUsers,
  fetchStatsFn
}: ClientProps) {
  const { selector: { sites, selectedSite, isLoading }, actions: { setIsLoading } } = useSites();
  const [stats, setStats] = useState<any>({
    unreadMessages: unreadMessages,
    totalVisits: 1213,
    totalUsers: totalUsers
  });

  useEffect(() => {
    async function fetchStats() {
      if (selectedSite) {
        setIsLoading(true);
        const data = await fetchStatsFn({ siteId: selectedSite?.id });
        const stats = {
          unreadMessages: data[0].number_of_unread_messages,
          totalVisits: 1213,
          totalUsers: data[0].number_of_users
        }

        setStats(prev => ({
          ...prev,
          ...stats
        }));

        setIsLoading(false);
      }
    }
    fetchStats();
  }, [selectedSite]);

  return (
    <>
      <SectionWrapper>
        <h1 className="mb-4">
          {isLoading ? (
            <Skeleton className="w-1/2 h-[1em]" />
          ) : (
            <>
              {isLoading ? (
                <Skeleton className="w-1/2 h-[1em]" />
              ) : (
                <span className="">
                  {sites && selectedSite && sites.find(site => site.id === selectedSite.id)?.name}
                </span>
              )}
            </>
          )}
        </h1>
      </SectionWrapper>
      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <WidgetItem>
            <StatCard
              isLoading={isLoading}
              title="Okunmamış Mesajlar"
              value={stats.unreadMessages}
              icon={<EnvelopeBadge />}
              actionLabel={<Link href="/messages" className="hover:underline">Tüm mesajları gör</Link>}
            />
          </WidgetItem>
          <WidgetItem>
            <StatCard 
            isLoading={isLoading} 
            title="Sayfa Ziyareti" 
            value={stats.totalVisits} 
            icon={<CursorRays />} 
              actionLabel={<Link href="/messages" className="hover:underline">Detaylı görüntüle</Link>}
            />
          </WidgetItem>
          <WidgetItem>
            <StatCard 
            isLoading={isLoading} 
            title="Toplam Kullanıcı" 
            value={stats.totalUsers} 
            icon={<Person3 />} 
            actionLabel={<Link href="/messages" className="hover:underline">Tümünü gör</Link>}
            />
          </WidgetItem>
        </div>
      </SectionWrapper>

      <div id="intersectionTarget" className="border-dashed border-t bottom-0 left-0 mt-2 w-full" style={{ height: 1 }} />
    </>
  );
}