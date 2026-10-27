import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muhammed PP | Personal Portfolio",
  description:
    "Student, computer technician, and DIGIHUB administrator exploring technology, networking, and web development through practical projects and experimentation. Based in Kolantha, Kerala.",
  keywords: [
    "Muhammed PP",
    "Portfolio",
    "Computer Technician",
    "DIGIHUB Administrator",
    "Darul Hasanath Islamic College",
    "Networking",
    "Web Development",
    "Kerala",
    "Kannur",
  ],
  authors: [{ name: "Muhammed PP", url: "https://muhammed-pp.vercel.app/" }],
  creator: "Muhammed PP",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://muhammed-pp.vercel.app/",
    title: "Muhammed PP | Personal Portfolio",
    description: "Curious by nature. Built through technology. Personal portfolio and project showcase of Muhammed PP.",
    siteName: "Muhammed PP Portfolio",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-[#050608] text-[#F5F7FA] antialiased selection:bg-[#1685FF] selection:text-white"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
