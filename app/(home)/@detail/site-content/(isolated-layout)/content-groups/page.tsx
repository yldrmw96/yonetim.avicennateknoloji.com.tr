"use client"
import SectionWrapper from "@/components/section-wrapper";
export default function ContentGroups() {
  return (
    <SectionWrapper>

      <div className="flex flex-col justify-center items-center h-full min-h-screen">
       <div>
          <div className="spinner_spinner__Wkf45"><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" /><div className="spinner_bar__tdAm1" />
          </div>
       </div>

        <span className="text-gray-500 text-xs font-medium mt-1 animate-shinning">Yükleniyor...</span>
      </div>
    </SectionWrapper>
  );
}