import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import Analytics from '@/components/analytics';
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "attend75 | Smart Attendance Calculator",
  description: "🎯 Smart attendance calculator with strategic leave management. Calculate safe bunking, optimize medical/duty leaves, and get actionable insights to maintain your target attendance percentage.",
  keywords: ["attendance calculator", "student tools", "attendance tracker", "medical leaves", "duty leaves", "safe bunking", "attendance percentage"],
  authors: [{ name: "IllumeWork" }],
  creator: "IllumeWork",
  publisher: "IllumeWork",
  
  // Open Graph tags for social media sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://attend75.illumework.com",
    siteName: "attend75",
    title: "attend75 | Smart Attendance Calculator",
    description: "🎯 Smart attendance calculator with strategic leave management. Calculate safe bunking, optimize medical/duty leaves, and get actionable insights to maintain your target attendance percentage.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "attend75 - Smart Attendance Calculator",
        type: "image/png",
      },
    ],
  },
  
  // Twitter Card tags
  twitter: {
    card: "summary_large_image",
    site: "@attend75",
    creator: "@IllumeWork",
    title: "attend75 | Smart Attendance Calculator",
    description: "🎯 Smart attendance calculator with strategic leave management. Calculate safe bunking and optimize your attendance strategy.",
    images: ["/og-image.png"],
  },
  
  // Additional metadata
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
  
  // Verification and other meta tags
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  
  // App-specific metadata
  applicationName: "attend75",
  category: "Education",
  
  // Icons and manifest
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#3B82F6" },
    ],
  },
  
  // Manifest for PWA
  manifest: "/site.webmanifest",
  
  // Theme colors
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  
  // Additional Open Graph properties
  other: {
    "og:image:alt": "attend75 - Smart Attendance Calculator with strategic leave management",
    "og:image:type": "image/png",
    "og:image:width": "1200",
    "og:image:height": "630",
    "twitter:image:alt": "attend75 - Smart Attendance Calculator",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "attend75",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 flex w-full max-w-7xl m-auto flex-row items-center justify-center bg-background text-foreground">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  )
}
