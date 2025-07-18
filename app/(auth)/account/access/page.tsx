"use client"
import { Button } from "@/components/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/extend/card";
import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { loginSchema, LoginInput } from "@/lib/schemas/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


export default function Page() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema as any),
    mode: "onChange",
  });
  return (
    <div className="flex justify-center items-center h-screen w-full relative">
     
      <Card className="w-full max-w-sm border shadow-xs overflow-hidden">
        <CardContent className="grid grid-cols-1 grid-rows-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center  relative">
          <span className="absolute row-start-1 row-span-3 border-b border-gray-200 top-0 left-0 w-full h-full z-0 bg-muted/50" />

         <div className="px-6 w-full z-10">
            <Image
              src="/logo-a.png"
              alt="Avicenna Teknoloji Logo"
              width={100}
              height={100}
              className="object-contain size-14"
            />
         </div>
          <CardTitle className="text-xl font-bold px-6 z-10">Giriş Yap</CardTitle>
          <CardDescription className="text-sm px-6 z-10">
            Tekrar hoş geldiniz! Lütfen bilgilerinizi girin.
          </CardDescription>
          <Label htmlFor="email" className="text-sm font-medium px-6 z-10">
            E-posta adresiniz
          </Label>
         <div className="px-6 flex flex-col gap-2 z-10">
            <Input
              id="email"
              type="email"
              placeholder="E-posta adresinizi girin"
              {...form.register("email")}
            />
            <Input
              id="password"
              type="password"
              placeholder="Şifrenizi girin"
              {...form.register("password")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
         </div>
          <div className="px-6 z-10">
            <Button
            disabled={!form.formState.isValid}
            size="sm"
            className="w-full">
              <span className="text-sm font-semibold">Devam Et</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="currentColor"
                className="bi bi-caret-right-fill"
                viewBox="0 0 16 16"
              >
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
              </svg>
            </Button>
          </div>
         
          <div className="bg-muted/50 flex h-full items-center justify-start px-6 z-10  ">
            <Link
              className="text-primary hover:underline text-sm flex items-center gap-1 font-medium"
              href="/account/forgot-password"
            >
              <span>Şifremi Unuttum</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
