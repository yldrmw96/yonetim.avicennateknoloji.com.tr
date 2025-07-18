"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PasswordInput, MailInput } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/store/hooks/auth.hook";
import { ActivityIndicator } from "@/components/global/activity-indicator";

import { LoginCredentials } from "@/types/LoginCredentials";
  
import { type User } from "@/lib/types/user.types";
import Copyright from "./components/copyright";
import { SupabaseAuthService } from "@/lib/services/supabase-auth.service";
import { SupabaseProfilesService } from "@/lib/services/supabase-profiles.service";
type Props = {
  className?: string;
  props?: React.ComponentPropsWithoutRef<"div">;
}

export default function PageClientSide({ className, ...props }: Props) {
  const [validatedEmail, setValidatedEmail] = useState<string>("");
  const { selector: { isLoading, error }, actions: { setIsLoading, setError, login } } = useAuth();

  // const _login = async (credentials: LoginCredentials): Promise<boolean> => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const endPoint = `${process.env.NEXT_PUBLIC_API_URL!}/api/v1/auth/login`;
  //     const requestInit: RequestInit = {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(credentials),
  //     }

  //     const response = await fetch(endPoint, requestInit);
  //     const jsonResponse = await response.json();

  //     if (jsonResponse.result_message.status === 'error') {
  //       setError(jsonResponse.result_message.message);
  //       return false;
  //     }
  //     const sessionToken = jsonResponse.token;
  //     login(jsonResponse.data as User, sessionToken);

  //     return true;
  //   } catch (err) {
  //     setError('Giriş sırasında bir hata oluştu.');
  //     return false;
  //   } finally {
  //     // console.log("finally", isLoading);
  //     setIsLoading(false);
  //   }
  // };

  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (step === "email") {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep("password");
      setValidatedEmail(email);
      setIsLoading(false);
      return;
    }

    await _login(e);

  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (step === "password" && name === "email" && value.length > 0 && value !== validatedEmail && (validatedEmail.length > 0 || email.trim().length > 0)) {
      setStep("email");
      setPassword("");
      return;
    }
    if (name === "email") {
      setEmail(value);
      if (value.length > 0) {
        setValidatedEmail(value);
      }
    }
    if (name === "password") {
      setPassword(value);
    }
  }

  const _login = async (e: React.FormEvent) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await SupabaseAuthService.signIn(email, password)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Giriş başarılı!')
      console.log(result)

      // Profil bilgilerini çek
      if (result.user) {
        const profileResult = await SupabaseProfilesService.getUserProfile(result.user.id)
        console.log(profileResult)
      }

      setEmail('')
      setPassword('')
    }

    setIsLoading(false)
  }


  return (
    <div className={cn(clss.container, className)}>
      {!success && (
        <div
          className={cn(
            "bg-background flex flex-col row-start-2 overflow-hidden gap-4 p-6 rounded-xl w-full max-w-md transition-all duration-300",
            className
          )}
          {...props}
        >
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <MailInput
                  id="email"
                  name="email"
                  type="email"
                  autoFocus
                  autoComplete="email"
                  autoCapitalize="off"
                  autoCorrect="off"
                  placeholder="Geçerli bir e-posta adresi girin"
                  disabled={isLoading || success}
                  value={email}
                  onChange={handleInputChange}
                  onFocus={(e) => e.target.select()}
                  required
                  className="font-medium rounded-none  "
                  containerClassName={cn(
                    "[&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-primary/80 ",
                    step === "password" && "rounded-b-none ",
                    error !== null && "bg-red-500/10 border-red-500"
                  )}
                  innerItem={
                    step === "email" && (
                      <Button
                        className="text-primary disabled:text-[var(--foreground)]" variant="flat" size="none"
                        disabled={email.length === 0 || isLoading}
                      >

                        {isLoading ? <ActivityIndicator style={{ "--spinner-color": "var(--color-gray-500)" } as React.CSSProperties} /> :
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56" style={{ fill: "currentColor" }} className="leading-none text-2xl"><path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 47.9219 C 16.9374 47.9219 8.1014 39.0625 8.1014 28 C 8.1014 16.9609 16.9140 8.0781 27.9765 8.0781 C 39.0155 8.0781 47.8983 16.9609 47.9219 28 C 47.9454 39.0625 39.0390 47.9219 27.9999 47.9219 Z M 40.0702 27.9766 C 40.0702 27.4844 39.8827 27.0859 39.4140 26.6172 L 31.4921 18.6719 C 31.1874 18.3672 30.7655 18.2031 30.2733 18.2031 C 29.3124 18.2031 28.5858 18.9297 28.5858 19.8906 C 28.5858 20.4063 28.7968 20.8281 29.1014 21.1328 L 32.0312 24.0390 L 34.8671 26.4063 L 29.9218 26.2188 L 17.6874 26.2188 C 16.6796 26.2188 15.9296 26.9688 15.9296 27.9766 C 15.9296 28.9844 16.6796 29.7344 17.6874 29.7344 L 29.9218 29.7344 L 34.8671 29.5469 L 32.0312 31.9375 L 29.1014 34.8203 C 28.7733 35.1484 28.5858 35.5703 28.5858 36.0859 C 28.5858 37.0234 29.3124 37.7968 30.2733 37.7968 C 30.7655 37.7968 31.1874 37.6094 31.4921 37.3047 L 39.4140 29.3594 C 39.8593 28.9141 40.0702 28.5156 40.0702 27.9766 Z" style={{ fill: "currentColor" }} /></svg>

                        }   </Button>
                    )}


                />
                <PasswordInput
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="font-medium rounded-none"
                  value={password}
                  autoFocus={true}
                  isLoading={isLoading}
                  onChange={handleInputChange}
                  required
                  containerClassName={cn(
                    "!z-2 rounded-t-none border-t-0 [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-primary/80 ",
                    error !== null && "bg-red-500/10 border-red-500"
                  )}
                  errorPopup={(
                    <Tooltip disableHoverableContent={true} open={error !== null} onOpenChange={() => setError(null)} variant="warning">
                      <TooltipTrigger asChild>
                        <p className="text-red-500 text-sm absolute bottom-0 left-1/2"></p>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className=" text-center" variant="warning">
                        <p >{error}</p>
                      </TooltipContent>
                    </Tooltip>

                  )}
                  innerItem={
                    step === "password" && (

                      <Button
                        className="text-primary disabled:text-gray-400" variant="flat" size="none"
                        disabled={email.length === 0 || isLoading}
                      >
                        {isLoading ? <ActivityIndicator style={{ "--spinner-color": "var(--color-gray-500)" } as React.CSSProperties} /> :
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56" style={{ fill: "currentColor" }} className="leading-none text-2xl"><path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 47.9219 C 16.9374 47.9219 8.1014 39.0625 8.1014 28 C 8.1014 16.9609 16.9140 8.0781 27.9765 8.0781 C 39.0155 8.0781 47.8983 16.9609 47.9219 28 C 47.9454 39.0625 39.0390 47.9219 27.9999 47.9219 Z M 40.0702 27.9766 C 40.0702 27.4844 39.8827 27.0859 39.4140 26.6172 L 31.4921 18.6719 C 31.1874 18.3672 30.7655 18.2031 30.2733 18.2031 C 29.3124 18.2031 28.5858 18.9297 28.5858 19.8906 C 28.5858 20.4063 28.7968 20.8281 29.1014 21.1328 L 32.0312 24.0390 L 34.8671 26.4063 L 29.9218 26.2188 L 17.6874 26.2188 C 16.6796 26.2188 15.9296 26.9688 15.9296 27.9766 C 15.9296 28.9844 16.6796 29.7344 17.6874 29.7344 L 29.9218 29.7344 L 34.8671 29.5469 L 32.0312 31.9375 L 29.1014 34.8203 C 28.7733 35.1484 28.5858 35.5703 28.5858 36.0859 C 28.5858 37.0234 29.3124 37.7968 30.2733 37.7968 C 30.7655 37.7968 31.1874 37.6094 31.4921 37.3047 L 39.4140 29.3594 C 39.8593 28.9141 40.0702 28.5156 40.0702 27.9766 Z" style={{ fill: "currentColor" }} /></svg>

                        }   </Button>
                    )
                  }
                />

              </div>
            </div>
          </form>

        </div>
      )}

      {success && (
        <ActivityIndicator
          className="row-start-2"
          style={{ "--spinner-color": "var(--color-gray-500)" } as React.CSSProperties} />
      )}

      <Copyright brand="Avicenna Teknoloji" className="row-start-3 text-center" />
    </div>
  );
}

const clss = {
  container: "[--container-md:21rem] min-h-screen  max-w-md w-full mx-auto h-full flex items-center transition-all duration-300 justify-center grid grid-rows-[1fr_auto_1fr]",
  card: "bg-background flex flex-col overflow-hidden gap-4 ring-2 ring-gray-200 p-6 rounded-xl w-full max-w-md transition-all duration-300",
}



