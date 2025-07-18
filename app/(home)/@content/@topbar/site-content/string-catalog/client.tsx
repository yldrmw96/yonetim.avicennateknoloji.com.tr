"use client"
import React from "react";


import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useLocalizationCatalog } from "@/store/hooks/localizationcatalog.hook";

import { useSites } from "@/store/hooks/sites.hook";
import { Ellipsis } from "lucide-react";

export default function LocalizationTopbar({ 
  supportedLanguages 
}: { supportedLanguages: any }) {
  
  const { selector: { languages: existingLanguages } } = useLocalizationCatalog()
  const { selector: { selectedSite } } = useSites();

  const handleSelectOnChange = async (value: string) => {
    await handleAddLanguage(value);
  }
  const handleAddLanguage = async (value: string) => {
    const lang_id = supportedLanguages[value].id;

    // console.warn(lang_id)
    if (!lang_id) {
      // console.error("Language not found");
      return;
    }

    if (value) {
      const response = await fetch(`/api/v1/languages/add/to-site`, {
        method: "POST",
        body: JSON.stringify({
          lang_id: lang_id,
          site_id: selectedSite?.id
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
      } else {
        // console.error("Failed to add language");
      }
    }
  }
  return (
    <div className="flex items-center gap-2 col-start-3 row-start-1 justify-end">
      <Select
        // value={selectedLanguage?.code}
        onValueChange={handleSelectOnChange}
      >
        <SelectTrigger className="border-none shadow-none !px-2 !ring-0 !bg-transparent text-xl [&_svg.lucide-chevron-down]:hidden">
          <Ellipsis className="" />
        </SelectTrigger>

        <SelectContent>
          {Object.keys(supportedLanguages).map((key: any) => (
            <SelectItem
              key={key.id}
              className="cursor-pointer hover:!bg-primary hover:!text-white"
              disabled={
                existingLanguages[key] !== null &&
                existingLanguages[key] !== undefined
              }
              value={key}>

              {supportedLanguages[key].name}
            </SelectItem>
          ))}
        </SelectContent>

      </Select>
    </div>
  );
}