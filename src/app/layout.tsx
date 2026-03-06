import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import SkipToContent from "@/components/SkipToContent";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.title} — ${SITE_CONFIG.name}`,
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: `${SITE_CONFIG.title} — ${SITE_CONFIG.name}`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.title,
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.title} — ${SITE_CONFIG.name}`,
    description: SITE_CONFIG.description,
    images: ["/api/og"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <body className="font-mono antialiased">
        <SkipToContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Tejas Naladala",
              url: "https://tejasnaladala.com",
              email: "tejas.naladala@gmail.com",
              jobTitle: "Founder & Engineer",
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "University of Washington",
              },
              sameAs: [
                "https://github.com/tejasnaladala",
                "https://linkedin.com/in/tejasnaladala",
                "https://instagram.com/simplytejxs",
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
