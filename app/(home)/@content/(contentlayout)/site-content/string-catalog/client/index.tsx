"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Language } from "@/types/Language";
import { useLocalizationCatalog } from "@/store/hooks/localizationcatalog.hook";

import { useSites } from "@/store/hooks/sites.hook";
import LanguageCompletionPercentage from "./components/language-completion-percentage";

import { Skeletoned } from "@/components/skeletoned";

interface StringCatalogLanguageListMenuClientProps {
  defaultValuesFromServer: Language[];
  fetchLanguages: (siteID: number) => Promise<Language[]>;
}

export default function StringCatalogLanguageListMenuClient({ defaultValuesFromServer, fetchLanguages }: StringCatalogLanguageListMenuClientProps) {

  const {
    selector: { languages, selectedLanguage, isLoading },
    actions: { setLanguages, setSelectedLanguage, setIsLoading }
  } = useLocalizationCatalog();

  const { selector: { selectedSite } } = useSites();

  useEffect(() => {
    setLanguages(defaultValuesFromServer);
    // console.log("defaultValuesFromServer",defaultValuesFromServer)
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!selectedSite) return;
      setIsLoading(true);
      const data = await fetchLanguages(selectedSite.id);
      setLanguages(data);
      setIsLoading(false);
      // console.log(data,"sffa")
      // Eğer dil seçili değilse, varsayılan olarak ilk dili ata
      if (!selectedLanguage && defaultValuesFromServer.length > 0) {
        setSelectedLanguage(defaultValuesFromServer.find((lang) => lang.isDefault) as Language);
      }
    };

    fetchInitialData();
  }, [selectedSite]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  return (
    <ul className="flex flex-col min-h-[100vh] border-t border-b w-full divide-y divide-border border-b">
      {Object.keys(languages).length > 0 && !isLoading && (
        Object.keys(languages).map((key) => (
          <li key={key}>
            <Button
              onClick={() => handleLanguageSelect(languages[key])}
              variant="ghost"

              className={cn(
                "hover:bg-sidebar-accent  rounded-none hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 !max-h-none p-4 px-6 text-sm leading-tight whitespace-nowrap last:border-b-0 w-full",
                selectedLanguage?.code === languages[key].code &&
                "pointer-events-none cursor-default"
              )}
            >

             <div className="flex flex-row items-center justify-between w-full ">
                <span className="text-sm font-medium me-auto">
                  {languages[key].name}
                </span>
                {!languages[key].isDefault && (
                  <LanguageCompletionPercentage percentage={0} />
                )}
             </div>
            </Button>
          </li>
        ))
      )}

      {isLoading && (
        <>
        <Skeletoned className="h-8 w-full px-6 rounded-md mb-2" loading={isLoading} />
        <Skeletoned className="h-8 w-full px-6 rounded-md mb-2" loading={isLoading}/>
        </>
      )}
    </ul>
  );
}
