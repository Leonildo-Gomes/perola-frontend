import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/components/common/providers";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pérola — Beauty & Wellness em Cabo Verde",
  description:
    "Marketplace de autocuidado e plataforma de gestão completa para salões, barbearias e spas em Cabo Verde.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0D9488",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${plusJakartaSans.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-teal-100 selection:text-teal-900">
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            className: "font-sans rounded-xl",
          }}
        />
      </body>
    </html>
  );
}

