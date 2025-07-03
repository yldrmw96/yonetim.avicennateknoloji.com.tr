"use client"
import SectionWrapper from "@/components/section-wrapper";
import { useEffect, useState } from "react";
import { useContentGroup } from "@/store/hooks/contentgroup.hook";

import { ContentGroupType } from "@/types/ContentGroupType";
import { useSites } from "@/store/hooks/sites.hook";
import { TreeNode } from "@/components/global/tree-node";

const contentData = {
  id: "root",
  name: "İçerik Yönetimi",
  type: "folder",
  children: [
    {
      id: "blog",
      name: "Blog",
      type: "folder",
      children: [
        {
          id: "tech",
          name: "Teknoloji",
          type: "folder",
          children: [
            { id: "ai-article", name: "Yapay Zeka Makalesi", type: "article" },
            { id: "web-dev", name: "Web Geliştirme", type: "article" },
          ],
        },
        {
          id: "lifestyle",
          name: "Yaşam Tarzı",
          type: "folder",
          children: [
            { id: "health", name: "Sağlık", type: "article" },
            { id: "travel", name: "Seyahat", type: "article" },
          ],
        },
      ],
    },
    {
      id: "pages",
      name: "Sayfalar",
      type: "folder",
      children: [
        { id: "about", name: "Hakkımızda", type: "page" },
        { id: "contact", name: "İletişim", type: "page" },
        { id: "services", name: "Hizmetler", type: "page" },
      ],
    },
    {
      id: "media",
      name: "Medya",
      type: "folder",
      children: [
        {
          id: "images",
          name: "Görseller",
          type: "folder",
          children: [
            { id: "hero-img", name: "Ana Görsel", type: "image" },
            { id: "gallery", name: "Galeri", type: "image" },
          ],
        },
        {
          id: "videos",
          name: "Videolar",
          type: "folder",
          children: [{ id: "intro-video", name: "Tanıtım Videosu", type: "video" }],
        },
      ],
    },
  ],
}
export default function ContentGroups() {
  const { selector: { contentGroups, selectedContentGroupId }, actions: { setContentGroups, setSelectedContentGroup } } = useContentGroup();
  const { selectedSite } = useSites();
  const [name, setName] = useState("");

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/content-groups/get/by-site/${selectedSite?.id}`);
    const data = await response.json();
    setContentGroups(data);
  };

  const groupContent = (groups: ContentGroupType[]) => {
    const grouped: Record<number, ContentGroupType> = {};
    groups.forEach(group => {
      // @ts-expect-error parent_id is not defined in ContentGroupType
      if (!group.parent_id) {
        if (!grouped[group.id]) {
          // @ts-expect-error parent_id is not defined in ContentGroupType
          grouped[group.id] = { ...group, children: [] };
        } else {
          // @ts-expect-error parent_id is not defined in ContentGroupType
          grouped[group.id] = { ...group, children: grouped[group.id].children };
        }
      } else {
        // @ts-expect-error parent_id is not defined in ContentGroupType
        if (!grouped[group.parent_id]) {
          // @ts-expect-error parent_id is not defined in ContentGroupType
          grouped[group.parent_id] = { id: group.parent_id, name: "", parent_id: null, children: [] };
        }
        // @ts-expect-error parent_id is not defined in ContentGroupType
        grouped[group.parent_id].children.push(group);
      }
    });
    return Object.values(grouped);
  };
  const handleSave = async () => {
    const response = await fetch("/api/v1/post/content-group", {
      method: "POST",
      body: JSON.stringify({ name, parent_id: null }),
    });
    const data = await response.json();
    console.log(data);
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

  const renderGroups = (groups: ContentGroupType[]) => {
    return groups.map(group => (
      <div key={group.id} className="flex flex-col">
        <div className="flex flex-col">
          {/* @ts-expect-error setSelectedContentGroup is not defined in ContentGroupType */}
          <ContentGroupItem id={group.id} label={group.label} name={group.name} isActive={selectedContentGroupId === group.id} setSelectedId={setSelectedContentGroup} />
          <div className="flex flex-col gap-2 ms-4" >
            {/* @ts-expect-error children is not defined in ContentGroupType */}
            {group.children.map((child: ContentGroupType) => (
              // @ts-expect-error setSelectedContentGroup is not defined in ContentGroupType
              <ContentGroupItem key={child.id} id={child.id} label={child.label} name={child.name} isActive={selectedContentGroupId === child.id} setSelectedId={setSelectedContentGroup} />
            ))}
          </div>
        </div>
      </div>
    ));
  };

  return (

    <SectionWrapper className="!px-0">
      <TreeNode
        node={contentData}
        level={0}
        expandedNodes={expandedNodes}
        onToggle={handleToggle}
        onSelect={setSelectedNode}
        selectedId={selectedNode?.id}
      />

      <div className="w-full divide-y divide-gray-200 border-t">

        {contentGroups && renderGroups(groupContent(contentGroups))}
      </div>

    </SectionWrapper>

  );
}

interface ContentGroupItemProps {
  id: number;
  label: string;
  name: string;
  isActive: boolean;
  setSelectedId: (id: number) => void;
}

function ContentGroupItem({ id, label, name, isActive, setSelectedId }: ContentGroupItemProps) {
  return (
    <button key={id} className={`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2  p-4 px-6 text-sm leading-tight whitespace-nowrap last:border-b-0`} onClick={() => setSelectedId(id)}>
      <div className="flex w-full items-center gap-2">
        <span className="">
          {name}
        </span>
        <span className="ms-auto truncate opacity-50 text-xs px-3 ">
          0 içerik.
        </span>
      </div>
    </button>
  );
}