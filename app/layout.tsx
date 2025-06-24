import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meu Blog - Desenvolvedor & Escritor",
  description: "Blog pessoal sobre desenvolvimento web, tecnologia e carreira. Compartilhando conhecimento e experiências em programação.",
  keywords: ["blog", "desenvolvimento", "programação", "tecnologia", "carreira", "next.js", "react", "typescript"],
  authors: [{ name: "Seu Nome" }],
  creator: "Seu Nome",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://seublog.com",
    title: "Meu Blog - Desenvolvedor & Escritor",
    description: "Blog pessoal sobre desenvolvimento web, tecnologia e carreira.",
    siteName: "Meu Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meu Blog - Desenvolvedor & Escritor",
    description: "Blog pessoal sobre desenvolvimento web, tecnologia e carreira.",
    creator: "@seutwitter",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
