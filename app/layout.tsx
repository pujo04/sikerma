import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SIKERMA - Dashboard",
    template: "SIKERMA - %s",
  },
  description: "Sistem Informasi Manajemen Kerjasama",
  generator: "",
  icons: {
    icon: [
      {
        url: "/img/sikerma.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/img/sikerma.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/img/sikerma.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/img/sikerma.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
