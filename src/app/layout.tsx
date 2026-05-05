import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import SkipToContent from "@/components/SkipToContent";
import ClaudeMascot from "@/components/profile/ClaudeMascot";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { DottedSurface } from "@/components/ui/dotted-surface";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

const METADATA_DESCRIPTION =
  "Building R0 Systems (plasma sanitization for post-harvest produce). Prev. founded PlasmaX ($2M seed). Also building Parchment Labs and delphi.";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.title} - ${SITE_CONFIG.name}`,
  description: METADATA_DESCRIPTION,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: `${SITE_CONFIG.title} - ${SITE_CONFIG.name}`,
    description: METADATA_DESCRIPTION,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.title,
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.title} - ${SITE_CONFIG.name}`,
    description: METADATA_DESCRIPTION,
    images: ["/api/og"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f5f4ef",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SkipToContent />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Tejas Naladala",
                url: "https://tejasnaladala.com",
                email: "naladala@uw.edu",
                jobTitle: "Founder & Engineer",
                description: METADATA_DESCRIPTION,
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
          {/* Live three.js dotted-wave field. Sits behind everything via -z-10
              and pauses on visibilitychange. */}
          <DottedSurface className="opacity-40" />
          {children}
          <ClaudeMascot />
        </ThemeProvider>
      </body>
    </html>
  );
}
