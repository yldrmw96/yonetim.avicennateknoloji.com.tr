import { Form } from "@/components/ui/form";
import { MailFormValues } from "@/lib/form-schemas";
import { SectionWrapper } from "@/components/section-wrapper";



export function SmtpMailSettingsFormLayout({form, onSubmit,children}: {form: Form<MailFormValues>, onSubmit: (values: MailFormValues) => void, children: React.ReactNode}) {
  return (
    <SectionWrapper>
      <Form {...form}>
        <form id="mail-settings-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {children}
        </form>
      </Form>
    </SectionWrapper>
  )
}

