import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata = {
  title: "Kenyan.menu | Create a Digital Menu for Your Restaurant",
  description: "Build a stunning digital menu in minutes. Perfect for restaurants, hotels, cafes, and bars in Kenya. Generate QR codes and shareable links instantly.",
  keywords: ["digital menu", "restaurant menu app", "QR code menu", "Kenya restaurant menu", "Kenyan.menu", "contactless menu"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
              "name": "Kenyan.menu",
              "operatingSystem": "Web",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "1500.00",
                "priceCurrency": "KES"
              },
              "description": "Digital menu platform for restaurants, hotels, and cafes in Kenya to generate QR codes and shareable links instantly.",
              "url": "https://kenyan.menu",
              "publisher": {
                "@type": "Organization",
                "name": "Kenyan.menu"
              }
            })
          }}
        />
        <ThemeProvider>
          <StatusProvider>
            {children}
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
