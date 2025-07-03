"use client";
import { SiteHeader } from "@/components/partials/nav/header";
import { PageTitle } from "@/components/page-title";
import { useRef } from "react";

import Optional from "@/types/Optional";
import { ReactNode, UIEvent } from "react";
import { useNavigation } from "@/store/hooks/navigation.hook";

type Props = {
  children: React.ReactNode;
  topbar: React.ReactNode;
};

export default function ContentLayout({
  children,
  topbar
}: Props & Optional<ReactNode>) {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const { actions: { setTitleDisplayMode } } = useNavigation();

  const onScroll = (e: UIEvent<HTMLElement>) => {
    if (targetRef.current === null || targetRef.current === undefined) return;

    const scrollDistanceFromTop = e.currentTarget.scrollTop;
    const { height: topbarHeight } = targetRef.current.getBoundingClientRect();

    const isTopbarInvisible = scrollDistanceFromTop > topbarHeight;
    setTitleDisplayMode(isTopbarInvisible);
  };

  const props = {
    id: "content",
    ref: contentRef,
    className: "w-full bg-background  relative max-h-screen overflow-scroll h-full min-h-screen flex flex-col pb-6",
    onScroll: onScroll
  }

  return (
    <main {...props}>
      <SiteHeader topbar={topbar} />
      <PageTitle ref={targetRef} />
      {children}
    </main>
  );
}