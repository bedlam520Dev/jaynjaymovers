import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SITE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Professional Moving Company`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "moving company",
    "movers",
    "residential moving",
    "commercial moving",
    "long distance moving",
    "packing services",
    "storage solutions",
    "Springfield IL",
    "Midwest movers",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE.url,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Professional Moving Company`,
    description: SITE.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Professional Moving Company`,
    description: SITE.description,
    images: ["/og-image.png"],
    creator: "@summitmovers",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  category: "business",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0d5c63" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1a2f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
