import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SITE, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    template: "%s | Allen Diaz",
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  alternates: {
    canonical: "/",
  },
  // Share images come from the file convention: app/opengraph-image.tsx
  // (file-based metadata overrides config-based images).
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

// JSON-LD structured data so search engines understand the site/person
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: SITE.author,
      url: SITE_URL,
      jobTitle: "Full-Stack & AI Engineer",
      image: `${SITE_URL}${SITE.ogImage}`,
      email: "mailto:allendiaz.developer@gmail.com",
      sameAs: [
        "https://github.com/AllenDiaz",
        "https://www.linkedin.com/in/allen-diaz-525071258/",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Albertsons Companies",
      },
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Three.js",
        "Python",
        "FastAPI",
        "Google Cloud Platform",
        "Artificial Intelligence",
        "Agentic AI",
        "Large Language Models",
        "Retrieval-Augmented Generation",
        "Model Context Protocol",
        "Agent Orchestration",
      ],
    },
    {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE_URL,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="portfolio-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
