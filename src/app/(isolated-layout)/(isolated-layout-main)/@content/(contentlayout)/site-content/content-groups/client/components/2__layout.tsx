"use client"
import SectionWrapper from "@/components/section-wrapper";
import { useEffect, useState } from "react";
import { useContentGroup } from "@/store/hooks/contentgroup.hook";

import { useSites } from "@/store/hooks/sites.hook";
import { TreeNode } from "@/components/global/tree-node";

export default function ContentGroups() {
  const { selector: { contentGroups, selectedContentGroupId } } = useContentGroup();
  const { selector: { selectedSite } } = useSites();
  const [contentData, setContentData] = useState<any>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  useEffect(() => {
    if (selectedSite) {
      fetchContentGroups();
    }
  }, [selectedSite]);

  useEffect(() => {
    fetchContentGroups();
  }, []);

  const fetchContentGroups = async () => {
    if (selectedSite === null) return;
    const response = await fetch(`https://yonetim.avicennateknoloji.com.tr/api/v1/content-groups/get/by-site`, {
      method: "POST",
      body: JSON.stringify({ siteId: selectedSite?.id }),
    });

    const data = await response.json();

    // Nested yapı oluşturma fonksiyonu
    const createNestedStructure = (items) => {
      const itemMap = {
        root: {
          id: "",
          name: "İçerik Yönetimi",
          label: "İçerik Yönetimi",
          children: []
        }
      };
      const result = [];

      // Önce tüm öğeleri bir map'e ekleyelim
      items.forEach(item => {
        itemMap.root.children.push({
          id: item.id,
          name: item.slug,
          label: item.label,
          children: []
        });
      });

      // Sonra parent-child ilişkilerini kuralım
      items.forEach(item => {
        if (item.parent_id === null) {
          result.push(itemMap.root);
        } else {
          const parent = itemMap.root.children.find(child => child.id === item.parent_id);
          if (parent) {
            parent.children.push(itemMap.root.children.find(child => child.id === item.id));
          }
        }
      });

      return result;
    };

    const nestedData = createNestedStructure(data);
    console.log("nestedData", nestedData);
    setContentData(nestedData);
  };

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root", "blog"]))
  const [selectedNode, setSelectedNode] = useState<any>(null)

  const handleToggle = (id: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedNodes(newExpanded)
  }
  const onToggle = (id: string) => {
    handleToggle(id)
  }
  const onSelect = (node: any) => {
    setSelectedNode(node)
  }


  return (

    <SectionWrapper className="!px-0">
      {contentData.length > 0 && (
        <TreeNode
          node={contentData[0]}
          level={0}
          expandedNodes={expandedNodes}
          onToggle={onToggle}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      )}
    </SectionWrapper>

  );
}
