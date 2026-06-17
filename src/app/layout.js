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
  title: "MyMenu",
  description: "Your smart digital menu companion",
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
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-text transition-colors duration-300">
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
