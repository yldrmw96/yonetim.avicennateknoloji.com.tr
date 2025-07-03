"use client";

import { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import {
  UserModal
} from "@/app/(isolated-layout)/(isolated-layout-main)/@sidebar/client/components/user-modal";

/**
 * Buradaki layout bileşeni,
 * kullanıcı arayüzünün ana bileşenidir.
 * 
 * Bu bileşen, sidebar, content, detail ve inspector bileşenlerini içerir.
 * 
 * Sidebar bileşeni, kullanıcı arayüzünün sol tarafında yer alır.
 * Content bileşeni, kullanıcı arayüzünün sağ tarafında yer alır.
 * Detail ve inspector bileşenleri, kullanıcı 
 * arayüzünün sağ tarafında yer alır ve
 * gerektiğinde açılır.
 */


interface Props<T> {
  sidebar: T;
  content: T;
  detail?: T | null;
  inspector?: T | null;
}

export default function Layout({
  sidebar,
  content,
  detail,
  inspector
}: Props<ReactNode>) {
  return (
    <SidebarProvider>
      {sidebar}
      <SidebarInset >
        {content}
        {detail}
        {inspector}
      </SidebarInset>
      <UserModal />
    </SidebarProvider>
  );
}