
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ImageIcon, Plus, Languages, GripVertical, GripHorizontal } from "lucide-react"
import { cn } from "@/lib/utils";
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
  console.log("data", data)
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
  console.log("contentGroup", contentGroup)
  console.log("nestedRoot", nestedRoot)
  if (!contentGroup) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
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
  console.log("stringCatalogData", stringCatalogData)
  console.log("key", stringCatalogGroupedByKeys)
  // Çocukları render etmek için yardımcı fonksiyon
  const renderChildren = (children: any[]) => {
    if (!children || children.length === 0) {
      return <></>
    }

    return (
      <ul className="">
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

  return (
    <div className="min-h-screen w-full">
      <div className=" overflow-scroll">
        <div className="">
          <div className="px-6 min-h-12 py-5">
            <h1 className="text-lg font-bold text-gray-800">{contentGroup.label}</h1>
            <p className="text-primary text-sm">@{contentGroup.slug}</p>

            <p className="text-xs opacity-50 mt-1">
              Bu içerik grubunun hiyerarşik yapısını aşağıda görebilirsiniz.
              Her bir öğe, alt öğeleriyle birlikte görüntülenmektedir.
            </p>
          </div>
          <div className="border-t border-b border-gray-200">
            <div className="flex px-6 py-1  items-center justify-between bg-primary">
              <div className="text-xs text-white">
                Toplam {countItems(contentGroup.children)} öğe, {stringCatalogData.length} dize ve 0 varlık.
              </div>
              <div className="text-xs text-white">
                ID: {contentGroup.id}
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200 border-b border-t">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={Object.keys(stringCatalogGroupedByKeys)[0]}
            >
              {Object.keys(stringCatalogGroupedByKeys).map((key) => (
                <AccordionItem key={key} value={key}>
                <AccordionTrigger className="text-sm px-6 py-1 rounded-none hover:bg-gray-100 cursor-pointer">
                  <div className="flex flex-row gap-2 items-center justify-start w-full">
                      <GripHorizontal  className="w-4 h-4 text-gray-500" />
                    <h2 className="text-sm">{key}</h2>
                      <Languages className="w-3 h-3 ms-auto opacity-30" />
                      <div className="!text-xs  opacity-30">
                      {stringCatalogGroupedByKeys[key].map((item: any) => item.lang_code.toUpperCase()).join(", ")}
                    </div>
                  </div>

                </AccordionTrigger>
                <AccordionContent className="flex flex-col  text-balance py-1 border-t border-gray-200 divide-y divide-gray-200 bg-sidebar">

                  {stringCatalogGroupedByKeys[key].map((item: any) => (
                    <div key={item.id + item.lang_code} className="text-sm text-gray-500 px-6 py-1 flex flex-row gap-2 items-center justify-start">
                      <div className="flex flex-row gap-2 items-center justify-start w-full">
                        <p className="text-primary">{item.lang_code.toUpperCase()}</p>
                        <p className={cn("text-sm",item.lang_code === "ar" ? "[direction:rtl] w-full" : "")}>{item.content}</p>
                        <span className="text-xs text-gray-500 italic">(content)</span>
                      </div>

                    </div>
                  ))}
                 
                </AccordionContent>
              </AccordionItem>
))}
           
            </Accordion>

            {renderChildren(contentGroup.children)}
          </div>

          
        </div>
      </div>
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