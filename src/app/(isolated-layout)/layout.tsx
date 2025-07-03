"use client";

import { Provider } from "react-redux";
import { store } from "@/store";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({
  children
}: LayoutProps) {
  return <Provider store={store} children={children} />
}