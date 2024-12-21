import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TopNotification from "@/components/topNotification";
import Footer from "@/components/footer";
import { SupportBanner } from "@/components/SupportBanner";

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
  title: "GenomicValley",
  description: "Genomic Valley is a Next Generation Sequencing based diagnostic and research company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-background font-sans antialiased ${geistSans.variable} ${geistMono.variable}`}>
        <TopNotification />
        <main className="mx-auto max-w-[1200px]">
          {children}
        </main>
        <SupportBanner />
        <div className="mx-auto max-w-[1200px]">
          <Footer />
        </div>
      </body>
    </html>
  );
}