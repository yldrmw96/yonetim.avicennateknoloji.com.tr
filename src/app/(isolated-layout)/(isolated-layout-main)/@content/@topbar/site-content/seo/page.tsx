"use client"

import { Button } from "@/components/ui/button";
import { useFormValidating } from "@/store/hooks/formvalidating.hook";


export default function SeoPageBottomBar() {
  const { selector: { seo } } = useFormValidating();
  return (
      <Button.Apply
      form="seo-settings-form"
      isLoading={seo.isSubmitting} 
      disabled={!seo.isValidating || !seo.isDirty || seo.isSubmitting} 
      className="col-start-3"
      />
  );
}