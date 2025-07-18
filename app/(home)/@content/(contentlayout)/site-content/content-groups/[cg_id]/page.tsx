
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GripHorizontal, Pencil } from "lucide-react"
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WatchTitleChanges } from "./titlec";
import { SessionService } from "@/lib/services/session.service";

export default async function ContentGroupDetail({ params }: { params: { cg_id: string } }) {
  const { cg_id } = await params;

  const user = await SessionService.getUserFromCookie();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/content-groups/get/by-site`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ siteId: user.selectedSiteId, cg_id: cg_id }),
  });

  if (!response.ok) {
    throw new Error("Veri çekme işlemi başarısız oldu");
  }

  const data = await response.json();
  // console.log("data", data)
  // Nested yapı oluşturma fonksiyonu

  // Nested yapı oluşturma fonksiyonu - EKSİK PARENT DÜZELTMESİ
  const createNestedStructure = (items: any[]) => {
    // Kök düğümü oluştur
    const root = {
      id: "root",
      name: "İçerik Yönetimi",
      label: "İçerik Yönetimi",
      children: []
    };

    // Tüm öğeleri ID ile eşleştir
    const itemMap: Record<string, any> = {};
    items.forEach(item => {
      itemMap[item.id] = {
        ...item,
        children: []
      };
    });

    // Hiyerarşiyi oluştur - EKSİK PARENTLER İÇİN DÜZELTME
    items.forEach(item => {
      const node = itemMap[item.id];

      if (item.parent_id === null) {
        root.children.push(node);
      } else {
        const parent = itemMap[item.parent_id];
        if (parent) {
          parent.children.push(node);
        } else {
          // Ebeveyn bulunamazsa köke ekle
          root.children.push(node);
        }
      }
    });

    return root;
  };

  const nestedRoot = createNestedStructure(data);

  // Kök düğümün ilk çocuğunu al (ana içerik grubu)
  const contentGroup = nestedRoot.children[0];
  // console.log("contentGroup", contentGroup)
  // console.log("nestedRoot", nestedRoot)
  if (!contentGroup) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <WatchTitleChanges title={contentGroup.label} />
        <div className="max-w-md w-full bg-white text-center">
          <h2 className="font-bold text-gray-800 mb-1">İçerik Grubu Bulunamadı</h2>
          <p className="text-gray-600 text-sm">Seçilen içerik grubu mevcut değil veya yüklenirken bir hata oluştu.</p>
        </div>
      </div>
    );
  }



  const stringCatalogResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/get/by-content-group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ site_id: user.selectedSiteId, cg_id: cg_id }),
  });

  if (!stringCatalogResponse.ok) {
    throw new Error("Veri çekme işlemi başarısız oldu");
  }

  const stringCatalogData = await stringCatalogResponse.json();
  const stringCatalogGroupedByKeys = Object.groupBy(stringCatalogData, (item: any) => item.key);
  // console.log("stringCatalogData", stringCatalogData)
  // console.log("key", stringCatalogGroupedByKeys)
  // Çocukları render etmek için yardımcı fonksiyon

  const filesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/get/by-content-group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cg_id: cg_id, site_id: user.selectedSiteId }),
  });

  if (!filesResponse.ok) {
    throw new Error("Veri çekme işlemi başarısız oldu");
  }

  const filesData = await filesResponse.json();
  // console.log("filesData", filesData)


  const renderChildren = (children: any[]) => {
    if (!children || children.length === 0) {
      return <></>
    }

    return (
      <ul className="px-4">
        {children.map((child) => (
          <li key={child.id} className=" px-2">
            <div className="font-medium">{child.label}</div>
            <div className="text-sm text-primary">@{child.slug}</div>
            {renderChildren(child.children)}
          </li>
        ))}
      </ul>
    );
  };

  const tabsHeader = (
    <TabsList tabStyle="flat" className="w-full  bg-transparent">
      <TabsTrigger value="account">Dizeler</TabsTrigger>
      <TabsTrigger value="password">Varlıklar</TabsTrigger>
    </TabsList>
  )

  


  return (
    <div className="min-h-screen w-full bg-card">
      <WatchTitleChanges title={contentGroup.label} />
      <Tabs defaultValue="account" className="w-full flex flex-col justify-end  w-full">
        {tabsHeader}
        <TabsContent value="account">
          <div className=" overflow-scroll">
            {
              Object.keys(stringCatalogGroupedByKeys).length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-4 bg-card">
                  <p className="text-sm opacity-50 py-4 px-4">Bu içerik grubu için dize bulunamadı.</p>
                </div>
              )
            }
            {
              Object.keys(stringCatalogGroupedByKeys).length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-gray-800 border-b border-t dark:border-gray-800">
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue={Object.keys(stringCatalogGroupedByKeys)[0]}
              >
                {Object.keys(stringCatalogGroupedByKeys).map((key) => (
                  <AccordionItem key={key} value={key}>
                    <AccordionTrigger className="text-sm px-6 py-1 rounded-none 
                    hover:bg-gray-100 dark:hover:bg-neutral-900 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-neutral-900 cursor-pointer">
                      <div className="flex flex-row gap-2 items-center justify-between truncate w-full">
                        <div className="flex flex-row gap-2 items-center justify-start">
                          <GripHorizontal className="w-4 h-4 opacity-30" />
                          <h2 className="text-sm truncate">{key}</h2>
                        </div>
                        <Pencil className="w-3 h-3 opacity-30" />
                      </div>

                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col  text-balance py-1 border-t border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800 bg-sidebar dark:bg-background">

                      {stringCatalogGroupedByKeys[key].map((item: any) => (
                        <div key={item.id + item.lang_code} className="text-sm opacity-50 px-6 py-1 flex flex-row gap-2 items-center justify-start">
                          <div className="flex flex-row gap-2 items-center justify-start w-full">
                            <p className="text-primary">{item.lang_code.toUpperCase()}</p>
                            {item.content.trim() !== "" && item.content.trim() !== null ? (
                              <p className={cn("text-sm", item.lang_code === "ar" ? "[direction:rtl] w-full" : "")}>{item.content}</p>

                            ) : (
                              <p className="text-sm text-gray-500 italic">(boş)</p>
                            )}
                            {/* <span className="text-xs text-gray-500 italic">(content)</span> */}

                          </div>

                        </div>
                      ))}

                    </AccordionContent>
                  </AccordionItem>
                ))}

              </Accordion>

              {renderChildren(contentGroup.children)}
            </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="password">
          {
            filesData.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-4 bg-card">
                <p className="text-sm opacity-50 py-4 px-4">Bu içerik grubu için varlık bulunamadı.</p>
              </div>
            )
          }
          <div className="overflow-scroll">
            <div className="grid grid-cols-2 gap-2">
              {filesData.map((file: any) => (
                <div key={"content-group-file-" + file.file_id} className="flex flex-col gap-2">
                  <img
                    src={`/uploads/images/resized/${file.resized_id}.${file.file_extension}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
}

// Yardımcı fonksiyon: İç içe öğeleri saymak için
const countItems = (children: any[]): number => {
  if (!children || children.length === 0) return 0;

  let count = children.length;
  children.forEach(child => {
    count += countItems(child.children);
  });
  return count;
};


/* <div className="px-6 min-h-12 mb-5">
            <p className="text-primary text-sm">@{contentGroup.slug}</p>

            <p className="text-xs opacity-50 mt-1">
              Bu içerik grubunun hiyerarşik yapısını aşağıda görebilirsiniz.
              Her bir öğe, alt öğeleriyle birlikte görüntülenmektedir.
            </p>
          </div> */
/* <div className="border-t  border-gray-200 dark:border-gray-800 dark:bg-sidebar-accent">
            <div className="flex px-6 py-2  items-center justify-between">
              <div className="text-xs text-gray-500 truncate">
                Toplam {countItems(contentGroup.children)} öğe, {stringCatalogData.length} dize ve 0 varlık.
              </div>

            </div>
          </div> */