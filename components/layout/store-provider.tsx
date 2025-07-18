"use client";

import { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import {
  UserModal
} from "@/app/(home)/@sidebar/client/components/user-modal";
import ReduxStoreProvider from "@/store/provider";

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
  children: T;
  detail?: T | null;
  inspector?: T | null;
}

export default function Layout({
  sidebar,
  content,
  children,
  detail,
  inspector
}: Props<ReactNode>) {
  return (
    <ReduxStoreProvider>
      <SidebarProvider>
        {sidebar}
        <SidebarInset >
          {content}
          {children}
          {detail}
          {inspector}
        </SidebarInset>
        <UserModal />
      </SidebarProvider>
    </ReduxStoreProvider>
  );
}