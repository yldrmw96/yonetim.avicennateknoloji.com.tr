"use client";

import {
  Check,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  X
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Gear, PersonFill, LockShieldFill, Person } from "framework7-icons/react";
import { useAuth } from "@/store/hooks/auth.hook";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { passwordFormSchema, PasswordFormValues, profileFormSchema, ProfileFormValues } from "@/lib/form-schemas";
import { setIsOpen } from "@/store/slices/user-modal-slice";

const data = {
  nav: [
    { name: "Hesap", icon: PersonFill },
    { name: "Güvenlik", icon: LockShieldFill },
    { name: "Sitelerim", icon: Gear },
    { name: "Yetkilendirmeler", icon: Person },
  ],
};

export function UserModal() {
  const dispatch = useDispatch();
  const modalOpen = useSelector((state: RootState) => state.userModal.isOpen);
  const { selector: { user }, actions: { setUser } } = useAuth();
  const [activeItem, setActiveItem] = useState<string>("Hesap");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [securityTabIsAccessible, setSecurityTabIsAccessible] = useState(false);
  const [securityPassword, setSecurityPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();


  function handleSecurityTabIsAccessible() {
    (async function checkSecurityTabIsAccessible() {
      const response = await fetch("/api/v1/auth/check-password", {
        method: "POST",
        body: JSON.stringify({
          userId: user?.id,
          password: securityPassword,
        }),
      });
      const data = await response.json();
      console.log("Şifre doğrulama yanıtı:", data);

      if (data.success) {
        setSecurityTabIsAccessible(true);
        passwordForm.setValue("currentPassword", securityPassword);
      } else {

      }
    })()
  }


  // Şifre değiştirme formu
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Profil düzenleme formu
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.first_name || "",
      familyName: user?.family_name || "",
      email: user?.email || "",
    },
  });

  // Şifre değiştirme işlemi
  const handlePasswordChange = async (values: z.infer<typeof passwordFormSchema>) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?.id,
          currentPassword: values.currentPassword,
          password: values.newPassword
        }),
      });

      const data = await response.json();
      console.log("Şifre değiştirme yanıtı:", data);

      if (data.result_message?.status === "success") {
        toast({
          title: "Başarılı",
          description: "Şifreniz başarıyla güncellendi. Lütfen tekrar giriş yapın.",
          variant: "default",
        });
        passwordForm.reset();

        // Başarılı şifre değişiminden sonra 3 saniye bekleyip çıkış yap
        setTimeout(() => {
          handleLogout();
        }, 3000);
      } else {
        toast({
          title: "Hata",
          description: "Şifre değiştirme işlemi başarısız oldu. Lütfen daha sonra tekrar deneyin.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Şifre değiştirme hatası:", error);
      toast({
        title: "Hata",
        description: "Şifre değiştirme sırasında bir sorun oluştu. Lütfen daha sonra tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Profil güncelleme işlemi
  const handleProfileUpdate = async (values: ProfileFormValues) => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {

      setIsLoading(false);
    }
  };

  // Çıkış yapma işlevi
  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth", {
        method: "DELETE",
      });
      window.location.href = "/login";
    } catch (error) {
      toast({
        title: "Hata",
        description: "Çıkış yapılırken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={() => dispatch(setIsOpen(!modalOpen))}>
      <DialogContent className="overflow-hidden bg-card/90 backdrop-blur-lg p-0 max-w-[95vw] max-h-[90vh] w-full md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader className="sr-only">
          <DialogTitle>Kullanıcı Ayarları</DialogTitle>
          <DialogDescription>
            Hesap ayarlarınızı buradan yönetebilirsiniz.
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-full min-h-[60vh] max-h-[80vh]">
          <SidebarProvider className="flex flex-1 p-1.5 gap-1.5 rounded-[0.4rem]">
            {/* Sidebar - Sol Panel */}
            <div className="w-64  rounded-[0.4rem]  bg-card/50 flex flex-col h-full border">
              <div className="flex flex-row items-center p-4 space-x-2 border-b">
                <Avatar className="border-2 border-primary/10">
                  <AvatarImage src={user?.avatar as string} />
                  <AvatarFallback className="bg-primary/5 text-primary">
                    {user?.first_name?.charAt(0) || "U"}
                    {user?.family_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.first_name + " " + user?.family_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Navigation Menu - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                  {data.nav.map((item) => (
                    <button
                      key={item.name}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${item.name === activeItem
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      onClick={() => setActiveItem(item.name)}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Sağ Panel */}
            <div className="flex-1 flex flex-col min-w-0 rounded-[0.4rem] border">
              {/* Header */}
              <div className="flex h-14 shrink-0 items-center gap-2 border-b bg-card/50 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Ayarlar</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeItem}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Content Area - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeItem === "Hesap" && (
                  <div className="max-w-2xl">
                    <div className="mb-6">
                      <h2 className="font-semibold">Profil Bilgileri</h2>
                      <p className="text-xs text-muted-foreground">
                        Kişisel bilgilerinizi güncelleyin
                      </p>
                    </div>

                    <Form {...profileForm}>
                      <form
                        onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
                        className="space-y-6"
                      >
                        <div className="flex flex-col items-center mb-6">
                          <Avatar className="size-24 mb-4 border-2 border-primary/10">
                            <AvatarImage src={user?.avatar as string} />
                            <AvatarFallback className="bg-primary/5 text-primary text-xl">
                              {user?.family_name?.charAt(0) || "U"}
                              {user?.first_name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <Button type="button" variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-2" />
                            Avatar Yükle
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ad</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="familyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Soyad</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-posta</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefon</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end pt-4">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Bilgileri Güncelle
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}

                {activeItem === "Güvenlik" && (
                  <div className="max-w-2xl">
                    {securityTabIsAccessible ? (
                      <div>
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold">Şifre Değiştirme</h2>
                          <p className="text-sm text-muted-foreground">
                            Hesabınızın güvenliği için şifrenizi düzenli olarak değiştirin
                          </p>
                        </div>

                        <Form {...passwordForm}>
                          <form
                            onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                            className="space-y-6"
                          >
                            <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Yeni Şifre</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type={showNewPassword ? "text" : "password"}
                                        {...field}
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                      >
                                        {showNewPassword ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    Şifreniz en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf,
                                    bir küçük harf ve bir rakam içermelidir.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={passwordForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Yeni Şifre (Tekrar)</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Şifre Güvenliği</Label>
                                <span
                                  className={`text-xs font-bold ${passwordForm.watch("newPassword").length >= 8
                                      ? "text-green-500"
                                      : "text-red-500"
                                    }`}
                                >
                                  {passwordForm.watch("newPassword").length >= 8 ? "Güçlü" : "Zayıf"}
                                </span>
                              </div>

                              <Progress
                                value={
                                  (passwordForm.watch("newPassword").length >= 8 ? 25 : 0) +
                                  (/[A-Z]/.test(passwordForm.watch("newPassword")) ? 25 : 0) +
                                  (/[a-z]/.test(passwordForm.watch("newPassword")) ? 25 : 0) +
                                  (/[0-9]/.test(passwordForm.watch("newPassword")) ? 25 : 0)
                                }
                              />

                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2">
                                  {/[A-Z]/.test(passwordForm.watch("newPassword")) ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <X className="h-3 w-3 text-red-500" />
                                  )}
                                  <span className="text-xs">Büyük harf</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {/[a-z]/.test(passwordForm.watch("newPassword")) ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <X className="h-3 w-3 text-red-500" />
                                  )}
                                  <span className="text-xs">Küçük harf</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {/[0-9]/.test(passwordForm.watch("newPassword")) ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <X className="h-3 w-3 text-red-500" />
                                  )}
                                  <span className="text-xs">Rakam</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {passwordForm.watch("newPassword").length >= 8 ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <X className="h-3 w-3 text-red-500" />
                                  )}
                                  <span className="text-xs">8+ karakter</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end pt-4">
                              <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Şifreyi Güncelle
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </div>
                    ) : (
                      <div className="max-w-md mx-auto text-center">
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold mb-2">Şifrenizi Girin</h2>
                          <p className="text-sm text-muted-foreground">
                            Devam etmek için mevcut şifrenizi girin.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <Input
                            type="password"
                            placeholder="Mevcut şifreniz"
                            value={securityPassword}
                            onChange={(e) => setSecurityPassword(e.target.value)}
                          />
                          <Button
                            type="button"
                            onClick={handleSecurityTabIsAccessible}
                            disabled={isLoading || !securityPassword}
                            className="w-full"
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Şifreyi Doğrula
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeItem === "Sitelerim" && (
                  <div className="max-w-4xl">
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold">Sitelerim</h2>
                      <p className="text-sm text-muted-foreground">
                        Sahip olduğunuz siteleri yönetin
                      </p>
                    </div>
                    <div className="text-center text-muted-foreground py-8">
                      Henüz site bulunmuyor.
                    </div>
                  </div>
                )}

                {activeItem === "Yetkilendirmeler" && (
                  <div className="max-w-4xl">
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold">Yetkilendirmeler</h2>
                      <p className="text-sm text-muted-foreground">
                        Uygulama izinlerinizi yönetin
                      </p>
                    </div>
                    <div className="text-center text-muted-foreground py-8">
                      Henüz yetkilendirme bulunmuyor.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SidebarProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}