"use client";
import { ActivityIndicator } from "@/components/global/activity-indicator";
import { Button } from "@/components/ui/button";
import { useFormValidating } from "@/store/hooks/formvalidating.hook";
import { useSites } from "@/store/hooks/sites.hook";

export default function MailPageBottomBar() {
  const { selector: { mail }, actions: { setIsSubmittingMail } } = useFormValidating();
  const { selector: { selectedSite } } = useSites();
  function onSubmit() {

    if (selectedSite == null) return;

    setIsSubmittingMail(true);
    if (!mail.isValidating || !mail.isDirty || mail.data == null) return;
    console.log(mail.data);
    fetch("/api/v1/mail/update", {
      method: "POST",
      body: JSON.stringify({
        mailHost: mail.data.mailHost,
        mailPort: mail.data.mailPort,
        mailUsername: mail.data.mailUsername,
        mailPassword: mail.data.mailPassword,
        siteId: selectedSite?.id
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          console.log("Değişiklikler kaydedildi");
        }
      })
      .finally(() => {
        setIsSubmittingMail(false);
      });
  }
  return (
    <>
    <Button
      type="submit"
      onClick={onSubmit}
      disabled={!mail.isValidating || !mail.isDirty || mail.isSubmitting}
      className="font-semibold ms-auto hover:!bg-transparent active:!bg-transparent col-start-3 text-primary bg-transparent"
    >
      {mail.isSubmitting ? <ActivityIndicator /> : "Uygula"}

    </Button>
    </>
  )
}