import { Geist, Geist_Mono, Inter, Nunito, Rubik } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toast";
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from "@/components/layout/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const props = {
    html: {
      lang: "tr",
      suppressHydrationWarning: true,
      className: "min-h-[100vh] overflow-hidden !dark"
    },
    meta: {
      viewport: {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }
    },
    body: {
      className: `${geistSans.variable} ${geistMono.variable} ${inter.variable} ${nunito.variable} ${rubik.variable} antialiased min-h-[100vh]  user-select-none `
    },
    topLoader: {
      color: "var(--primary)",
      showSpinner: true
    },
    themeProvider: {
      attribute: "class" as const,
      defaultTheme: "system",
      enableSystem: true,
      disableTransitionOnChange: true
    }
  }
  return (
    <html {...props.html}>
      <head>
        <meta {...props.meta.viewport} />
      </head>
      <body {...props.body}>
        <NextTopLoader {...props.topLoader} />
        <ThemeProvider {...props.themeProvider} >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}


