
import { createClient } from '@/lib/supabase/client'
import { Metadata } from 'next'
import { SupabaseAuthService } from '@/lib/services/supabase-auth.service'
import { SupabaseProfilesService } from '@/lib/services/supabase-profiles.service'
import UserDebugPage from './client/index'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import LoginClientSide from './client/login-client-side'

export const metadata: Metadata = {
  title: 'Hesap Erişimi',
  description: 'Hesap Erişimi',
}

export default async function SupabaseAuthExamplePage() {
  // console.log('Server: Fetching user data...')
  
  // Server-side user bilgilerini al
  const initialUser = await SupabaseAuthService.getCurrentUserServer()
  const initialSession = await SupabaseAuthService.getCurrentSessionServer()

  let initialProfile = null
  if (!initialUser) {
    return (
      <LoginClientSide />
    )
  } else {
  // Eğer kullanıcı varsa profil bilgilerini de al
  if (initialUser) {
    const profileResult = await SupabaseProfilesService.getUserProfileServer(initialUser.id)
    initialProfile = profileResult.profile
  }

  
  const languagesData = await SupabaseProfilesService.getAllLanguages()
  // console.log('languages:', languagesData.languages)
  const data = await SupabaseProfilesService.getUserSites(initialProfile?.id)
  // console.log('sites:', data.sites)

  async function addLanguage(language: any)  : Promise<PostgrestSingleResponse<any>> {
    "use server"
    const supabase = createClient()
    const result = await supabase.from('language').insert(language).select().single()
    return result
  }

  async function assignLanguageToSite(languageCode: string, siteId: string)  : Promise<PostgrestSingleResponse<any>> {
    "use server"
    const supabase = createClient()
    const result = await supabase.from('rel_site_languages').insert({
      site_uuid: siteId,
      language_code: languageCode
    }).select().single()
    return result
  }
  async function getStrCatalog(siteId: string)  : Promise<PostgrestSingleResponse<any>> {
    "use server"
    const supabase = createClient()
    const result = await supabase.rpc('get_translations_by_site', { site_uuid: siteId }).select()
    // console.log('strCatalog:', result)
    return result
  }
  async function getContentCatalog(siteId: string): Promise<PostgrestSingleResponse<any>> {
    "use server"
    const supabase = createClient()
    const result = await supabase.rpc('get_content_group_tree', { root_site_uuid: siteId }).select()
    // console.log('contentCatalog:', result)
    return result
  }

  async function getStrKeys() {
    "use server"
    const supabase = createClient()
    const result = await supabase.from('str_key').select('*')
    // console.log('strKeys:', result)
    return result
  }

  const {data: initialStrKeys} = await getStrKeys()
  // console.log('initialStrKeys:', initialStrKeys)

  const {data: initialContentCatalog} = await getContentCatalog(data.sites[0].id)
  // console.log('initialContentCatalog:', initialContentCatalog)
  const {data: initialStrCatalog} = await getStrCatalog(data.sites[0].id)

  async function addStrKey(strKey: any)  : Promise<PostgrestSingleResponse<any>> {
    "use server"
    const supabase = createClient()
    const result = await supabase.from('str_key').insert({
      ...strKey,
    }).select().single()
    // console.log('addStrKey:', result)
    return result
  }
  async function addStrContent(strKeyId: string, strContentLanguage: string, strContent: string)  : Promise<PostgrestSingleResponse<any>> {
    "use server"
    const supabase = createClient()
    const result = await supabase.from('str_catalog').insert({
      key_uuid: strKeyId,
      language_code: strContentLanguage,  
      content: strContent,
      group_uuid: '24f275c9-c7c1-4b7d-af8f-48e803112b5b'
    }).select().single()
    // console.log('addStrContent:', result)
    return result
  }

  return (

    <UserDebugPage 
      initialUser={initialUser} 
      initialSession={initialSession}
      initialProfile={initialProfile}
      initialSites={data.sites}
      initialLanguages={languagesData.languages}
      addLanguageAction={addLanguage}
      assignLanguageToSiteAction={assignLanguageToSite}
      initialStrCatalog={initialStrCatalog}
      initialContentCatalog={initialContentCatalog} 
      addStrKeyAction={addStrKey}
      initialStrKeys={initialStrKeys}
        addStrContentAction={addStrContent}
      />
    )
  }
} 