import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TopNotification from "@/components/topNotification";
import Footer from "@/components/footer";
import { SupportBanner } from "@/components/SupportBanner";
import { SiteHeader } from "@/components/site-header";
import Providers from '@/components/Providers';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Genomic Valley",
  description: "Genomic Valley is a Next Generation Sequencing based diagnostic and research company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-background font-sans bg-purple-50 antialiased ${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <TopNotification />
          <main className="mx-auto max-w-[1200px]">
            {children}
          </main>
          <SupportBanner />
          <div className="mx-auto max-w-[1200px]">
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}