import { Geist, Geist_Mono, Caveat, Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";

import StatusProvider from "@/providers/StatusProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://ourmenu.click/"),
  title: "QR Code Menu | Digital Menu for Restaurants | OurMenu",
  description: "Create a digital menu for your restaurant. Add dishes, prices and photos, publish your menu online and let customers scan a QR code to view it.",
  keywords: ["digital menu", "restaurant menu app", "QR code menu", "OurMenu", "contactless menu"],
  openGraph: {
    title: "QR Code Menu | Digital Menu for Restaurants | OurMenu",
    description: "Create a digital menu for your restaurant. Add dishes, prices and photos, publish your menu online and let customers scan a QR code to view it.",
    url: "https://ourmenu.click/",
    siteName: "OurMenu",
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Menu | Digital Menu for Restaurants | OurMenu",
    description: "Create a digital menu for your restaurant. Add dishes, prices and photos, publish your menu online and let customers scan a QR code to view it.",
  },
  alternates: {
    canonical: "/",
  }
};

import KeyboardAvoidingWrapper from "@/components/KeyboardAvoidingWrapper";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('mymenu-theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />

      </head>
      <body className="min-h-full flex flex-col bg-surface text-text transition-colors duration-300">
        {/* JSON-LD Structured Data for AI Agents & Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "OurMenu.Click",
              "operatingSystem": "Web",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "1999.00",
                "priceCurrency": "KES"
              },
              "description": "Digital menu platform for restaurants, hotels, and cafes in Kenya to generate QR codes and shareable links instantly.",
              "url": "https://ourmenu.click/",
              "publisher": {
                "@type": "Organization",
                "name": "OurMenu.Click"
              }
            })
          }}
        />
        <ThemeProvider>
          <StatusProvider>
            <KeyboardAvoidingWrapper>
              {children}
            </KeyboardAvoidingWrapper>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--theme-surface-elevated)',
                  color: 'var(--theme-text)',
                  border: '1px solid var(--theme-border)',
                },
                success: {
                  style: {
                    background: '#16a34a',
                    color: '#ffffff',
                    border: '1px solid #15803d',
                  },
                  iconTheme: {
                    primary: '#ffffff',
                    secondary: '#16a34a',
                  },
                },
              }}
            />
          </StatusProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
