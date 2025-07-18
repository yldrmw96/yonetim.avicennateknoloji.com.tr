"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityIndicator } from "@/components/global/activity-indicator";
import { CheckIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";

export default function AiGenerateContent({ initialStrKeys, initialLanguages, functions: { generateContent, handleAddStrContent } }: any) {
  const [strKeyId, setStrKeyId] = useState('')
  const [strContentLanguage, setStrContentLanguage] = useState('')
  const [strContent, setStrContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiContent, setAiContent] = useState('')
  const [aiError, setAiError] = useState('')
  const [aiSuccess, setAiSuccess] = useState(false)

  const handleAiGenerateContent = async (strKeyId: string, strContentLanguage: string, strContent: string) => {
    setAiLoading(true)
    const result = await generateContent(initialStrKeys.find((strKey: any) => strKey.uuid === strKeyId)?.key, strContentLanguage)
    setStrContent(result)
    setAiContent(result)
    setAiSuccess(true)
    setAiError(null)
    setAiLoading(false)
  }

    return (
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
                    key={"select-strkey-" + strKey.uuid}
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
          <Button disabled={aiLoading} type="button" variant="outline" size="icon" onClick={(e) => handleAiGenerateContent(strKeyId, strContentLanguage, strContent)}>
            {aiLoading ? <ActivityIndicator /> : <SparklesIcon />}
            </Button>


          <Button disabled={!strKeyId || !strContentLanguage || !strContent || loading} type="button" variant="outline" size="icon" onClick={(e) => handleAddStrContent(e)}><CheckIcon /></Button>
        </div>
      </div>
    )
}