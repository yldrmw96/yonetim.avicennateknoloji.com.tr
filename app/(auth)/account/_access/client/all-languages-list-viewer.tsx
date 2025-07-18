'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Separator } from "@/components/ui/separator"
import React from "react"

export default function AllLanguagesListViewer({ initialLanguages, initialSites, initialUser, initialProfile, initialSession, initialStrCatalog, initialContentCatalog, initialStrKeys }: any) {
  React.useEffect(() => {
    console.log('initialLanguages', initialStrCatalog)
  }, [initialStrCatalog])

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full"
      >
        <AccordionItem value="item-3">
          <AccordionTrigger>      <h4 className="font-semibold text-sm">Kullanıcı Bilgileri</h4></AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <div>
              <p><strong>ID:</strong> {initialUser.id}</p>
              <p><strong>Email:</strong> {initialUser.email}</p>
              <p><strong>Oluşturulma Tarihi:</strong> {new Date(initialUser.created_at).toLocaleString('tr-TR')}</p>
              <p><strong>Güncelleme Tarihi:</strong> {new Date(initialUser.updated_at).toLocaleString('tr-TR')}</p>
              {initialUser.email_confirmed_at && (
                <p><strong>Email Onaylanma Tarihi:</strong> {new Date(initialUser.email_confirmed_at).toLocaleString('tr-TR')}</p>
              )}

              {initialProfile && (
                <>
                  <Separator className="my-4" />
                  <h4 className="font-semibold text-sm">Profil Bilgileri</h4>
                  <div className="space-y-1 text-sm">

                    {initialProfile.username && <p><strong>Kullanıcı Adı:</strong> {initialProfile.username}</p>}
                    {initialProfile.avatar_url && <p><strong>Avatar:</strong> {initialProfile.avatar_url}</p>}
                    <p><strong>Profil ID:</strong> {initialProfile.id}</p>
                  </div>
                </>
              )}

            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>      <h4 className="font-semibold text-sm">Site Bilgileri  </h4></AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <div className="space-y-1 text-sm">
              {initialSites.map((site: any) => (
                <div key={site.id}>
                  <p><strong>Site ID:</strong> {site.id}</p>
                  <p><strong>Site Adı:</strong> {site.name}</p>
                  <p><strong>Site Durumu:</strong> {site.status}</p>
                  <p><strong>Site Oluşturulma Tarihi:</strong> {new Date(site.created_at).toLocaleString('tr-TR')}</p>
                  <p><strong>Site Desteklenen Diller:</strong> {site.supported_languages.map((language: any) => language.name).join(', ')}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-1">
          <AccordionTrigger>      <h4 className="font-semibold text-sm">Sistem Desteklenen Diller</h4></AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            {initialLanguages && initialLanguages.length > 0 && (
              <div className="space-y-1 text-sm">
                {initialLanguages.map((language: any) => (
                  <div key={"language-" + language.code}>
                    <p><strong>Dil Adı:</strong> {language.name}</p>
                    <p><strong>Dil Kodu:</strong> {language.code}</p>
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </>
  )
}