"use client"
import SectionWrapper from "@/components/section-wrapper";
import { ActivityIndicator } from "@/components/global/activity-indicator";
export default function ContentGroups() {
  return (
    <SectionWrapper>

      <div className="flex flex-col justify-center items-center h-full min-h-screen">
        <ActivityIndicator/>

        <span className="text-gray-500 text-xs font-medium mb-4 animate-pulse">Yükleniyor...</span>
      </div>
    </SectionWrapper>
  );
}