"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Language } from "@/types/Language";
import { useLocalizationCatalog } from "@/store/hooks/localizationcatalog.hook";

import { generateHashedIdentifierFromParams } from "@/lib/generate-hashed-identifier-from-params";
import { useSites } from "@/store/hooks/sites.hook";
import LanguageCompletionPercentage from "./language-completion-percentage";

import { Skeletoned } from "@/components/skeletoned";

interface StringCatalogLanguageListMenuClientProps {
  defaultValuesFromServer: Language[];
}

export default function StringCatalogLanguageListMenuClient({ defaultValuesFromServer }: StringCatalogLanguageListMenuClientProps) {
  
  const {
    selector: { languages, selectedLanguage, localizationCatalog, isLoading },
    actions: { setLanguages, setSelectedLanguage, setLocalizationCatalog, setIsLoading }
  } = useLocalizationCatalog();

  const { selector: { selectedSite } } = useSites();


  async function fetchSiteLanguages() {
    if (!selectedSite) return;
    const res = await fetch(
      `/api/v1/string-catalog/get/by-site/${selectedSite?.id}`,
      {
        method: "POST",
      }
    );
    const data = await res.json();
    return data;
  }

  useEffect(() => {

    setLanguages(defaultValuesFromServer);
    setIsLoading(false);
  }, []);

  // İlk yükleme: dilleri ve tüm stringleri getir (sadece bir kez)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!selectedSite || localizationCatalog.length > 0) return;

      setIsLoading(true);

      const data = await fetchSiteLanguages();

      const transformed = data.reduce((acc: Record<string, any>, item: any) => {
        const compositeKey = `${item.group_id}_${item.key}`;
        if (!acc[compositeKey]) {
          const localizations = defaultValuesFromServer.reduce((obj, lang) => {
            obj[lang.code] = {
              state: "untranslated",
              value: "",
              isDefault: lang.isDefault,
            };
            return obj;
          }, {} as Record<string, { state: string; value: string; isDefault: boolean }>);

          acc[compositeKey] = {
            id: generateHashedIdentifierFromParams(item.group_id, item.key),
            key: item.key,
            group_id: item.group_id,
            localizations,
          };
        }

        acc[compositeKey].localizations[item.lang_code] = {
          state: "translated",
          value: item.content,
        };

        return acc;
      }, {});

      setLocalizationCatalog(Object.values(transformed));
      setIsLoading(false);

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
    <ul className="flex flex-col [&_button]:my-1 divide-y divide-gray-200 px-3 min-h-[100vh]">
      {languages.length > 0 && !isLoading ? (
        languages.map((language) => (
          <li key={language.id}>
            <Button
              onClick={() => handleLanguageSelect(language)}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full transition-none py-[0.35rem] flex flex-row justify-center items-center",
                selectedLanguage?.code === language.code &&
                "!bg-primary !text-primary-foreground"
              )}
            >
              <span className="text-sm font-medium me-auto">
                {language.name}
              </span>
              {language.code !== "tr" && (
                <LanguageCompletionPercentage percentage={0} />
              )}
            </Button>
          </li>
        ))
      ) : (
        <ul className="flex flex-col [&_div]:my-1 divide-y divide-gray-200 px-3 min-h-[100vh]">

          <Skeletoned className="h-8 w-full rounded-md" loading={isLoading}>

          </Skeletoned>
          <Skeletoned className="h-8 w-full rounded-md" loading={isLoading}>

          </Skeletoned>
        </ul>
      )}
    </ul>
  );
}
