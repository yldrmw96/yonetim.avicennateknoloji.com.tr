'use client'
import tableStyles from '@/styles/table.module.css'
import React, { useState, useEffect } from 'react'
import { SupabaseAuthService, SupabaseUser } from '@/lib/services/supabase-auth.service'
import { SupabaseProfilesService, UserProfile } from '@/lib/services/supabase-profiles.service'
import { Button } from '@/components/ui/button'
import { Input, IsolatedInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckIcon, ChevronDownIcon, GripHorizontalIcon, PlusIcon, SparklesIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EditableTextareaWithButton, Textarea } from '@/components/ui/textarea'
import AiGenerateContent from "./ai";
import AllLanguagesListViewer from './all-languages-list-viewer'

interface SupabaseAuthExampleProps {
  initialUser?: SupabaseUser | null
  initialSession?: any
  initialProfile?: UserProfile | null
  initialSites?: any
  initialLanguages?: any
  addLanguageAction?: (language: any) => Promise<any>
  assignLanguageToSiteAction?: (languageCode: string, siteId: string) => Promise<any>
  initialStrCatalog?: any
  initialContentCatalog?: any
  addStrKeyAction?: (strKey: any) => Promise<any>
  initialStrKeys?: any[]
  addStrContentAction?: (strKeyId: string, strContentLanguage: string, strContent: string) => Promise<any>
}

export default function UserDebugPage({ initialUser, initialSession, initialProfile, initialSites, initialLanguages, addLanguageAction, assignLanguageToSiteAction, initialStrCatalog, initialContentCatalog, addStrKeyAction, initialStrKeys, addStrContentAction }: SupabaseAuthExampleProps) {
  const [strContent, setStrContent] = useState('')
  const [strContentLanguage, setStrContentLanguage] = useState('')
  const [strKeyId, setStrKeyId] = useState('')  
    
  const [languageCode, setLanguageCode] = useState('')
  const [languageName, setLanguageName] = useState('')
  const [siteId, setSiteId] = useState('')
  const [languageId, setLanguageId] = useState('')
  const [strKey, setStrKey] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [user, setUser] = useState<SupabaseUser | null>(initialUser || null)
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function generateContent(strContentKey: string, strContentLanguage: string) {
    setLoading(true)
   try {
    const result = await fetch('/api/v1/ai/gemini', {
      method: 'POST',
      body: JSON.stringify({ text: strContentKey, targetLang: strContentLanguage }) 
    })
    const data = await result.json()
    return data.translation
   } catch (error) {
    // console.log(error)
   } finally {
    setLoading(false)
   }
  }
  // Auth state değişikliklerini dinle
  useEffect(() => {
   

    // Eğer server-side'da user yoksa client-side'da kontrol et
    if (!initialUser) {
      // console.log('Client: No initial user, checking client-side...')
      const checkUser = async () => {
        const currentUser = await SupabaseAuthService.getCurrentUser()
        setUser(currentUser)

        if (currentUser) {
          // Kullanıcı varsa profil bilgilerini de al
          const profileResult = await SupabaseProfilesService.getUserProfile(currentUser.id)
          setProfile(profileResult.profile)
        }

        // console.log('Client: User check complete:', { hasUser: !!currentUser })
      }
      checkUser()
    } else {
      // console.log('Client: Using initial user data')

      // Eğer user var ama profil yoksa profil çek
      if (!initialProfile && initialUser) {
        const fetchProfile = async () => {
          const profileResult = await SupabaseProfilesService.getUserProfile(initialUser.id)
          setProfile(profileResult.profile)
        }
        fetchProfile()
      }
    }

    // Auth state change listener
    const { data: { subscription } } = SupabaseAuthService.onAuthStateChange(
      async (event, session) => {
        // console.log('Auth state changed:', event, session)
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user as SupabaseUser)

          // Profil bilgilerini çek
          const profileResult = await SupabaseProfilesService.getUserProfile(session.user.id)
          setProfile(profileResult.profile)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const result = await SupabaseAuthService.signIn(email, password)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Giriş başarılı!')
      setUser(result.user)

      // Profil bilgilerini çek
      if (result.user) {
        const profileResult = await SupabaseProfilesService.getUserProfile(result.user.id)
        setProfile(profileResult.profile)
      }

      setEmail('')
      setPassword('')


    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    // console.log('Client: Çıkış işlemi başlatılıyor...')

    try {
      // Maksimum 4 saniye timeout
      const signOutPromise = SupabaseAuthService.signOut()
      const timeoutPromise = new Promise<{ error: string | null }>((resolve) =>
        setTimeout(() => resolve({ error: null }), 4000)
      )

      const result = await Promise.race([signOutPromise, timeoutPromise])

      // console.log('Client: Çıkış işlemi sonucu:', result)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Çıkış başarılı!')
      }

      // Her durumda local state'i temizle
      setUser(null)
      setProfile(null)

      // Çıkış sonrası yönlendir (hata olsa bile)
      // setTimeout(() => {
      //   console.log('Client: Yönlendirme yapılıyor...')
      //   window.location.href = '/account/access'
      // }, 1000)

    } catch (error) {
      // console.error('Client: Çıkış işlemi hatası:', error)

      // Hata durumunda da local state'i temizle
      setUser(null)
      setProfile(null)
      setSuccess('Çıkış yapıldı (local)')

      // Hata durumunda da yönlendir
      // setTimeout(() => {
      //   console.log('Client: Hata durumu yönlendirme yapılıyor...')
      //   window.location.href = '/account/access'
      // }, 1000)
    } finally {
      setLoading(false)
    }
  }
const [performAddLanguageRequest, setPerformAddLanguageRequest] = useState(false)
  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      setPerformAddLanguageRequest(true)

      const result = await addLanguageAction({ code: languageCode, name: languageName })
      // console.log(result)
      setSuccess("Dil eklendi")
    } catch (error) {
      // console.log(error)
      setError("Dil eklenemedi")
    } finally {
      setLoading(false)
      setPerformAddLanguageRequest(false)
    }
  }

  const handleAssignLanguageToSite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const result = await assignLanguageToSiteAction(languageId, siteId)
      // console.log(result)
      setSuccess("Dil atandı")
    } catch (error) {
      // console.log(error)
      setError("Dil atanamadı")
    } finally {
      setLoading(false)
    }
  }

  const handleAddStrContent = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
        const result = await addStrContentAction(strKeyId, strContentLanguage, strContent)
      // console.log('result:', result)
      setSuccess("Content added")
    } catch (error) {
      // console.log(error)
      setError("Content not added")
    } finally {
      setLoading(false)
    }
    }


  return (
    <div className="border-l border-r container font-mono h-screen max-w-4xl mx-auto p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hesap Erişimi</h1>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
      </div>

      {/* Kullanıcı Durumu */}
      {user ? (
        <Card variant="flat_nopadding" className="mb-6">
          <CardHeader className="p-0">
            <CardTitle className="flex items-center gap-2">
              Oturum Açık
              <Badge variant="secondary">Aktif</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
        
              <Separator className="my-4" />
              <AllLanguagesListViewer 
                initialLanguages={initialLanguages} 
                initialSites={initialSites} 
                initialUser={user} 
                initialProfile={profile} 
                initialSession={initialSession} 
                initialStrCatalog={initialStrCatalog} 
                initialContentCatalog={initialContentCatalog} 
                initialStrKeys={initialStrKeys} 
                />  
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-2 items-baseline w-full">
                <div>
                  <span>Add Language to Database</span>
                </div>
                <div className="flex flex-row w-full gap-2 justify-end items-center">
                  <IsolatedInput type="text" placeholder="Enter Language code to add 'language' table."  performSaveRequest={(value) => setLanguageCode(value)} saveRequestLoading={performAddLanguageRequest} />

                  <IsolatedInput type="text" placeholder="Enter Language name to add 'language' table."  performSaveRequest={(value) => setLanguageName(value)} saveRequestLoading={performAddLanguageRequest} />
                  <Button disabled={loading} type="button" variant="outline" size="icon" onClick={(e) => handleAddLanguage(e)}><CheckIcon /></Button>
                </div>
              </div>

              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-2 items-baseline w-full">
                <div className="">
                  <span>Assign Language to Site</span>
                </div>
                <div className="flex flex-row gap-2 justify-end items-center w-full">
                  <Select
                    value={languageId}
                    onValueChange={(value) => setLanguageId(value)}  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sites</SelectLabel>
                        {initialLanguages.map((language: any) => (
                          <SelectItem
                            key={"select-language-" + language.code}
                            value={language.code}
                            disabled={initialSites.some((site: any) => site.default_language_code === language.code || site.supported_languages.some((supportedLanguage: any) => supportedLanguage.code === language.code))}
                          >
                            {language.name} - {language.code}
                          </SelectItem>
                        ))}

                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select value={siteId} onValueChange={(value) => setSiteId(value)} >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sites</SelectLabel>
                        {initialSites.map((site: any) => (
                          <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                        ))}

                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button disabled={!languageId || !siteId || loading} type="button" variant="outline" size="icon" onClick={(e) => handleAssignLanguageToSite(e)}><CheckIcon /></Button>
                </div>
              </div>

              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-2 items-baseline w-full">
                <div className="">
                  <span>Assign String Key to Site</span>
                </div>
                <div className="flex flex-row gap-2 justify-end items-center w-full">
                  <Select
                    value={languageId}
                    onValueChange={(value) => setLanguageId(value)}  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sites</SelectLabel>
                        {initialLanguages.map((language: any) => (
                          <SelectItem
                            key={"select-strkey--language-" + language.code}
                            value={language.code}
                          >
                            {language.name} - {language.code}
                          </SelectItem>
                        ))}

                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input type="text" placeholder="Enter String Key" value={strKey} onChange={(e) => setStrKey(e.target.value)} />
                  <Button disabled={!languageId || !strKey || loading} type="button" variant="outline" size="icon" onClick={(e) => handleAssignLanguageToSite(e)}><CheckIcon /></Button>
                </div>
              </div>
           <Separator className="my-4" />
      
                <div className="grid grid-cols-[10rem_auto] gap-2 items-baseline w-full">
                  <div className="">
                    <span>Str Keys</span>
                  </div>
                  <div className="flex flex-row gap-2 justify-end items-center w-full">
                    <Select
                      value={strKeyId}
                      onValueChange={(value) => setStrKeyId(value)}  >
                      <SelectTrigger >
                        <SelectValue placeholder="Select a str key" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Str Keys</SelectLabel>
                          {initialStrKeys.map((strKey: any) => (
                            <SelectItem
                              key={"select-strkey-" + strKey.id}
                              value={strKey.uuid}
                            >
                              {strKey.key}
                            </SelectItem>
                          ))}

                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select value={strContentLanguage} onValueChange={(value) => setStrContentLanguage(value)} >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Languages</SelectLabel>
                          {initialLanguages.map((language: any) => (
                            <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
                          ))}

                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Input type="text" placeholder="Enter Content" value={strContent} onChange={(e) => setStrContent(e.target.value)} />  
                      <Button disabled={ loading} type="button" variant="outline" size="icon" onClick={(e) => generateContent(initialStrKeys.find((strKey: any) => strKey.uuid === strKeyId)?.key, strContentLanguage || initialSites[0].default_language_code)}><SparklesIcon /></Button>
                    <Button disabled={!strKeyId || !strContentLanguage || !strContent || loading} type="button" variant="outline" size="icon" onClick={(e) => handleAddStrContent(e)}><CheckIcon /></Button>
                  </div>
                </div>
              <AiGenerateContent initialStrKeys={initialStrKeys} initialLanguages={initialLanguages} functions={{ generateContent, handleAddStrContent }} />
              <Separator className="my-4" />

              {initialContentCatalog && Object.keys(initialContentCatalog).length > 0 && (
                <div className={tableStyles.outer}>
                  <div className={cn(tableStyles.frame_limit, "mt-[var(--default-min-list-item-height)]")}>

                    <div className={cn(tableStyles.scrollable, "flex flex-col divide-y divide-muted/50 ")}>
                      {initialLanguages.map((language: any) => (
                        <button key={"select-content-language-" + language.code} className="w-full p-2 hover:bg-muted/50 transition-all duration-50 text-left cursor-pointer" onClick={() => setSelectedLanguage(language.code)}>
                          {language.name} - {language.code}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div 
                  className={cn(tableStyles.frame_limit, "mb-auto")}
                  >

                    <div className={cn(tableStyles.scrollable, "divide-y  text-sm ")}>
                      <div className={tableStyles.row_layout_header}>
                        <div className={tableStyles.cell}>
                          <span>Key</span>
                        </div>
                          <div className={tableStyles.cell}>
                            <span>{initialSites[0].default_language_code}</span>
                          </div>
                          {selectedLanguage && selectedLanguage !== initialSites[0].default_language_code && (
                            <div className={tableStyles.cell}>
                              <span>{initialSites[0].supported_languages.find((language: any) => language.code === selectedLanguage)?.name}</span>
                            </div>
                          )}
                      </div>
                      {initialContentCatalog.content_groups.map((contentGroup: any) => (
                        <React.Fragment key={contentGroup.uuid}>
                          <div className={tableStyles.row_layout}>
                            <div className={cn(tableStyles.cell, "[--cell-span:6]")}>
                              <div className="flex flex-row items-center gap-2 col-span-full">
                                <ChevronDownIcon className="w-4 h-4" />
                                <span>{contentGroup.name}</span>
                              </div>
                              <div className="flex flex-row items-center gap-2 ml-auto">
                                <PlusIcon className="w-4 h-4 ml-auto" />
                                <GripHorizontalIcon className="w-4 h-4 dark:text-muted-foreground text-muted/50" />
                              </div>
                            </div>
                          </div>
                          {contentGroup.hasOwnProperty('translations') && Object.keys(contentGroup.translations).length > 0 &&

                            Object.keys(contentGroup.translations).sort((a: any, b: any) => a.created_at - b.created_at).map((translationKey: any) => (
                              <div key={translationKey} className={tableStyles.row_layout}>
                                <div className={cn(tableStyles.cell, tableStyles.row_actionable, "opacity-50")}>
                                  {translationKey}
                                </div>
                                <div className={tableStyles.cell}>
                                  <span className="text-ellipsis overflow-hidden truncate">{contentGroup.translations[translationKey][initialSites[0].default_language_code]?.content ?? "Empty"}</span>
                                </div>
                                {selectedLanguage && selectedLanguage !== initialSites[0].default_language_code && (
                                  <div className={cn(tableStyles.cell, tableStyles.row_actionable)}>
                                    <Textarea rows={1} className=" text-ellipsis overflow-hidden truncate !inline-block line-clamp-1 resize-none " variant="flat_nopadding_nooutline" value={contentGroup.translations[translationKey][selectedLanguage || 'en']?.content ?? "Empty"} />
                                    <span className="hidden text-ellipsis overflow-hidden truncate"> {contentGroup.translations[translationKey][selectedLanguage || 'en']?.content ?? "Empty"}</span>
                                  </div>
                                )}
                           
                              </div>
                            ))

                          }

                        

                        </React.Fragment>
                      ))}
                      <div  className={tableStyles.row_layout}>
                        <div className={cn(tableStyles.cell, tableStyles.row_actionable)}>
                          <EditableTextareaWithButton 
                            rows={1} 
                            performSave={async (value) => {
                              const result = await addStrKeyAction({
                                key: value
                              })
                              return result.status === 200
                            }}
                            />
                  
                        </div>
                        {/* <div className={cn(tableStyles.cell, tableStyles.row_actionable)}>
                          <EditableTextareaWithButton
                            rows={1}
                            placeholder="Original Content..."
                          />
                        </div>
                          <div className={cn(tableStyles.cell, tableStyles.row_actionable)}>
                          <EditableTextareaWithButton
                            rows={1}
                            placeholder="Translation..."
                          />
                          </div> */}
                        

                      </div>
                      <div className="w-full h-full peer bg-muted/50 grow shrink-0 flex relative"></div>

                    </div>
                  </div>

                </div>
              )}

              {!profile && user && (
                <>
                  <Separator className="my-4" />
                  <p className="text-sm text-muted-foreground">Profil bilgileri yükleniyor...</p>
                </>
              )}
            </div>
            <Separator className="my-4" />
            <Button onClick={handleSignOut} variant="outline" disabled={loading}>
              {loading ? 'Çıkış Yapılıyor...' : 'Çıkış Yap'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Oturum Kapalı
              <Badge variant="secondary">Pasif</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <p className="text-muted-foreground">
              Sisteme giriş yapmak için aşağıdaki sekmeleri kullanın.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Hata ve Başarı Mesajları */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Auth İşlemleri */}
      {!user && (

        <Card>
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>
              Mevcut hesabınız ile giriş yapın.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Şifre</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>
          </CardContent>
        </Card>


      )}


    </div>
  )
} 