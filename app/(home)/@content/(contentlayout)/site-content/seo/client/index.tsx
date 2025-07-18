"use client";
import { SectionWrapper } from "@/components/section-wrapper";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useEffect } from "react";
import { seoFormSchema, SeoFormValues } from "@/lib/form-schemas";
import { useSites } from "@/store/hooks/sites.hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeletoned } from "@/components/skeletoned";
import { useFormValidating } from "@/store/hooks/formvalidating.hook";

interface Props {
  defaultValues: SeoFormValues;
  getSeoSettings: (siteID: number) => Promise<any>;
}

export function SeoPage({
  defaultValues, getSeoSettings
}: Props) {

  const { selector: { selectedSite } } = useSites();
  const { selector: { isLoading }, actions: { setIsLoading, setIsSeoFormValidating, setIsDirtySeo, setIsDataSeo, setIsSubmittingSeo } } = useFormValidating();

  useEffect(() => {
    if (selectedSite === null) return;

    const fetchSeo = async () => {
      setIsLoading(true);
      const data = await getSeoSettings(Number(selectedSite.id));
      form.reset(data);
      setIsLoading(false);
    }
    fetchSeo();

  }, [selectedSite]);


  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      metaTitle: defaultValues.metaTitle,
      metaDescription: defaultValues.metaDescription,
      metaKeywords: defaultValues.metaKeywords,
      metaAuthor: defaultValues.metaAuthor,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    handleChange()
  }, [
    form.formState.isValid, 
    form.formState.isDirty,
    ...Object.values(form.getValues())
  ])

  
  function handleChange() {

    setIsSeoFormValidating(form.formState.isValid);
    setIsDirtySeo(form.formState.isDirty);
    setIsDataSeo(form.getValues());
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingSeo(true);
    if (!form.formState.isValid || !form.formState.isDirty || form.getValues() == null) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/seo/update`, {
      method: "POST",
      body: JSON.stringify({
        metaTitle: form.getValues().metaTitle,
        metaDescription: form.getValues().metaDescription,
        metaKeywords: form.getValues().metaKeywords,
        metaAuthor: form.getValues().metaAuthor,
        siteId: selectedSite.id
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          // console.log(data.error);
        } else {
          // console.log("Değişiklikler kaydedildi");
        }
      })
      .finally(() => {
        setIsSubmittingSeo(false);
      });
  }

  return (
    <SectionWrapper>
      <Form {...form}>
        <form id="seo-settings-form" className="space-y-4 py-6" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem className="w-full !gap-y-0 grid grid-cols-1 md:grid-cols-2 gap-x-4 transition-all duration-300">
                <div className="flex flex-col items-start mb-3 md:mb-0 gap-y-1">
                  <Skeletoned className="h-4 w-20 rounded-lg" loading={isLoading}>
                    <FormLabel className="flex items-center">
                      Meta Sayfa Başlık
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                  </Skeletoned>

                  <FormMessage />

                </div>
                <FormControl>
                  <Skeletoned className="h-10 w-full rounded-lg" loading={isLoading}>
                    <Input placeholder="Meta Title" {...field} className={
                      field.value ? "" : "border-red-300 focus:ring-red-500"
                    } />
                  </Skeletoned>
                </FormControl>
                <Skeletoned className="h-4 w-1/2 rounded-lg" loading={isLoading}>
                  <FormDescription className="mt-1.5 md:mt-0">
                    Web sayfanızın başlığını belirler. Google{"'"}da görünür.
                  </FormDescription>
                </Skeletoned>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem className="w-full !gap-y-0 grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div className="flex flex-col items-start mb-3 md:mb-0 gap-y-1">
                  <Skeletoned className="h-4 w-20 rounded-lg" loading={isLoading}>
                    <FormLabel className=" flex items-center">
                      Meta Açıklama
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                  </Skeletoned>
                  <FormMessage />

                </div>
                <FormControl>
                  <Skeletoned className="h-10 w-full rounded-lg" loading={isLoading}>
                    <Input placeholder="Meta Description" {...field} className={
                      field.value ? "" : "border-red-300 focus:ring-red-500"
                    } />
                  </Skeletoned>
                </FormControl>
                <Skeletoned className="h-4 w-1/2 rounded-lg" loading={isLoading}>
                  <FormDescription className="mt-1.5 md:mt-0">
                    Web sayfanızın açıklamasını belirler. Google{"'"}da görünür.
                  </FormDescription>
                </Skeletoned>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaKeywords"
            render={({ field }) => (
              <FormItem className="w-full !gap-y-0  grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div className="flex flex-col items-start mb-3 md:mb-0 gap-y-1">
                  <Skeletoned className="h-4 w-20 rounded-lg" loading={isLoading}>
                    <FormLabel className="flex items-center">
                      Meta Anahtar Kelimeler
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                  </Skeletoned>
                  <FormMessage />

                </div>
                <FormControl>
                  <Skeletoned className="h-10 w-full rounded-lg" loading={isLoading}>
                    <Input placeholder="Meta Keywords" {...field} className={
                      field.value ? "" : "border-red-300 focus:ring-red-500"
                    } />
                  </Skeletoned>
                </FormControl>
                <Skeletoned className="h-4 w-1/2 rounded-lg" loading={isLoading}>
                  <FormDescription className="mt-1.5 md:mt-0">
                    Web sayfanızın anahtar kelimelerini belirler. Google{"'"}da
                    görünür.
                  </FormDescription>
                </Skeletoned>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaAuthor"
            render={({ field }) => (
              <FormItem className="w-full grid grid-cols-1 md:grid-cols-2 !gap-y-0 gap-x-4">
                <div className="flex flex-col items-start mb-3 md:mb-0 gap-y-1">
                  <Skeletoned className="h-4 w-20 rounded-lg" loading={isLoading}>
                    <FormLabel className="flex items-center">
                      Meta Author
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                  </Skeletoned>
                  <FormMessage />
                </div>
                <FormControl>
                  <Skeletoned className="h-10 w-full rounded-lg" loading={isLoading}>
                    <Input placeholder="Meta Author" {...field} className={
                      field.value ? "" : "border-red-300 focus:ring-red-500"
                    } />
                  </Skeletoned>
                </FormControl>
                <Skeletoned className="h-4 w-1/2 rounded-lg" loading={isLoading}>
                  <FormDescription className="mt-1.5 md:mt-0">
                    Web sayfanızın yazarını belirler. Google{"'"}da görünür.
                  </FormDescription>
                </Skeletoned>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </SectionWrapper>
  );
}
