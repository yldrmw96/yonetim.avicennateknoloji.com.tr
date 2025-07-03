"use client"
import { useNavigation } from "@/store/hooks/navigation.hook";
import { useEffect, useState } from "react";

export const WatchTitleChanges = ({ title }: { title: string }) => {
  const { actions: { setCustomTitle } } = useNavigation();
  useEffect(() => {
    setCustomTitle(title);
  }, []);
  return <></>;
}