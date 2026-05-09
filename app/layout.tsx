import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "B-Forms | AI-Powered Multilingual Form Builder",
    template: "%s | B-Forms",
  },
  description: "Transform your prompts into beautiful, professional, and multilingual forms in seconds. B-Forms uses advanced AI to automate form creation, sharing, and analysis.",
  keywords: ["AI form builder", "multilingual forms", "prompt to form", "survey builder", "automated surveys", "B-Forms", "AI Asset Builder"],
  authors: [{ name: "B-Forms Team" }],
  creator: "B-Forms",
  publisher: "B-Forms",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bforms.ai",
    siteName: "B-Forms",
    title: "B-Forms | Build Professional Forms with AI",
    description: "Describe your form in natural language and get a complete, multilingual solution in seconds.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "B-Forms AI Form Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "B-Forms | AI-Powered Form Builder",
    description: "Transform prompts into professional forms instantly with AI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
