"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { mailFormSchema, MailFormValues } from "@/lib/form-schemas";

import { useSites } from "@/store/hooks/sites.hook";

import { useLocalizationCatalog } from "@/store/hooks/localizationcatalog.hook";
import { Skeletoned } from "@/components/skeletoned";
import SmtpMailSettingsForm from "./components";
import { useFormValidating } from "@/store/hooks/formvalidating.hook";

export default function MailSettingsForm({ 
  mailSettings, 
  getMailSettings, 
  updateSelectedSiteId 
}: {
    mailSettings: Record<string, string>,
    getMailSettings: (siteID: number) => Promise<any>,
    updateSelectedSiteId: (siteId: number) => Promise<any>
  }) {
  const { selector: { selectedSite }, actions: { setIsLoading } } = useSites();
  const { selector: { isLoading }  } = useLocalizationCatalog();
  const { actions: { setIsDirty, setIsData, setIsMailFormValidating } } = useFormValidating();
  useEffect(() => {
    if (selectedSite === null) return;
    updateSelectedSiteId(Number(selectedSite.id));

    const fetchMailSettings = async () => {
      setIsLoading(true);
      const data = await getMailSettings(Number(selectedSite.id));
      form.reset(data);
      setIsLoading(false);
    }
    fetchMailSettings();
  }, [selectedSite]);

  const form = useForm<MailFormValues>({
    resolver: zodResolver(mailFormSchema),
    defaultValues: {
      mailHost: mailSettings.mailHost,
      mailPort: mailSettings.mailPort,
      mailUsername: mailSettings.mailUsername,
      mailPassword: mailSettings.mailPassword,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    handleChange()
  }, [form.formState.isValid, form.formState.isDirty])


  const handleChange = () => {
    // console.log(form.formState)
    setIsMailFormValidating(form.formState.isValid);
    setIsDirty(form.formState.isDirty);
    setIsData(form.getValues());
  }

  function onSubmit(values: MailFormValues) {
    // console.log("Form validasyonu başarılı:", values);
  }

  return (
    <SmtpMailSettingsForm.Layout form={form} onSubmit={onSubmit}>

      <FormField
        control={form.control}
        name="mailHost"
        render={({ field }) => (
          <FormItem className="w-full !gap-y-0 grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div className="flex flex-col items-start mb-3 md:mb-0 gap-y-1 justify-center">

              <FormLabel className="flex items-center">
                <Skeletoned className="h-4 w-20 rounded-lg" loading={isLoading}>
                  Mail Host
                </Skeletoned>
              </FormLabel>
              <FormMessage />

            </div>
            <FormControl

            >
              <Skeletoned className="h-10 w-full rounded-lg" loading={isLoading}>
                <Input
                  placeholder="Mail Host"
                  {...field}
                  className={
                    field.value ? "" : "border-red-300 focus:ring-red-500"
                  }
                />
              </Skeletoned>
            </FormControl>
            <FormDescription className="mt-1.5 md:mt-0">
              <Skeletoned as="span" className="h-4 w-1/2 rounded-lg" loading={isLoading}>
                Mail sunucunuzun host adresini belirler (zorunlu alan).
              </Skeletoned>
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="mailPort"
        render={({ field }) => (
          <FormItem className="w-full !gap-y-0 grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div className="flex flex-col items-start mb-3 md:mb-0 gap-y-1 justify-center">

              <FormLabel className="flex items-center">
                <Skeletoned className="h-4 w-20 rounded-lg" loading={isLoading}>
                  Mail Port
                </Skeletoned>
              </FormLabel>
              <FormMessage />

            </div>

            <FormControl>
              <Skeletoned className="h-10 w-full rounded-lg" loading={isLoading}>
                <Input
                  placeholder="Mail Port"
                  {...field}
                  className={
                    field.value ? "" : "border-red-300 focus:ring-red-500"
                  }
                />
              </Skeletoned>
            </FormControl>
            <FormDescription className="mt-1.5 md:mt-0">
              <Skeletoned as="span" className="h-4 w-1/2 rounded-lg" loading={isLoading}>
                Mail sunucunuzun port numarasını belirler (zorunlu alan).
              </Skeletoned>
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="mailUsername"
        render={({ field }) => (
          <FormItem className="w-full !gap-y-0  grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div className="flex flex-col items-start mb-3 md:mb-0 gap-y-1 justify-center">

              <FormLabel className="flex items-center">
                <Skeletoned className="h-4 w-20 rounded-lg" loading={isLoading}>
                  Mail Kullanıcı Adı
                </Skeletoned>
              </FormLabel>
              <FormMessage />

            </div>
            <FormControl>
              <Skeletoned className="h-10 w-full rounded-lg" loading={isLoading}>
                <Input
                  placeholder="Mail Kullanıcı Adı"
                  {...field}
                  className={
                    field.value ? "" : "border-red-300 focus:ring-red-500"
                  }
                />
              </Skeletoned>
            </FormControl>
            <FormDescription className="mt-1.5 md:mt-0">
              <Skeletoned as="span" className="h-4 w-1/2 rounded-lg" loading={isLoading}>
                Mail sunucunuzun kullanıcı adını belirler (zorunlu alan).
              </Skeletoned>
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="mailPassword"
        render={({ field }) => {
          return (
            <FormItem className="w-full grid grid-cols-1 md:grid-cols-2 !gap-y-0 gap-x-4">
              <div className="flex flex-col items-start mb-3 md:mb-0 gap-y-1 justify-center">

                <FormLabel className="flex items-center">
                  <Skeletoned className="h-4 w-20 rounded-lg" loading={isLoading}>
                    Mail Şifresi
                  </Skeletoned>
                </FormLabel>
                <FormMessage />

              </div>
              <FormControl>

                <Skeletoned className="h-10 w-full rounded-lg" loading={isLoading}>
                  <Input
                    type="password"
                    placeholder="Mail Şifresi"
                    {...field}
                    className={
                      field.value ? "" : " !border-red-300 !ring-red-500"
                    }
                  />
                </Skeletoned>

              </FormControl>
              <FormDescription className="mt-1.5 md:mt-0">
                <Skeletoned as="span" className="h-4 w-1/2 rounded-lg" loading={isLoading}>
                  Mail sunucunuzun şifresini belirler (zorunlu alan).
                </Skeletoned>
              </FormDescription>
            </FormItem>
          )
        }}
      />
    </SmtpMailSettingsForm.Layout>
  );
}
