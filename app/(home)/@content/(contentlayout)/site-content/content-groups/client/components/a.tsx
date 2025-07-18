"use client"
import SectionWrapper from "@/components/section-wrapper";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContentGroup } from "@/store/hooks/contentgroup.hook";
import { ContentGroupType } from "@/types/ContentGroupType";
import { GroupTransition } from "./GroupTransition";
import { useSites } from "@/store/hooks/sites.hook";

export default function ContentGroups() {
  const { selector: { contentGroups, selectedContentGroupId } } = useContentGroup();
  const { selector: { selectedSite } } = useSites();
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
    // console.log(data);
  };


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

    <SectionWrapper className="!px-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">İçerik Grubu Ekle</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              İçerik grubu eklemek için isim giriniz.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                İsim
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>

          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSave}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full">
        <GroupTransition />

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
    <div className="flex flex-col" key={id}>
      <div className="flex flex-col">
        <button className={`w-full text-left py-1 rounded-md ${isActive ? "bg-primary text-white" : ""}`} onClick={() => setSelectedId(id)}>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col items-start justify-center" >
              <span className="me-auto  px-3 font-semibold text-sm leading-none truncate">
                {label}
              </span>
              <span className="me-auto leading-none px-3 text-xs opacity-50 truncate">
                {name}
              </span>
            </div>

            <span className="ms-auto truncate opacity-50 text-xs px-3 ">
              0 içerik.
            </span>
          </div>
        </button>
        <div className="flex flex-col gap-2 ms-4" >
        </div>
      </div>
    </div>
  );
}