import { SiteHeader } from "@/components/site-header";
import { FloatingSocialButtons } from "@/components/floatingbutton";
import Footer from "@/components/footer";
import { SupportBanner } from "@/components/SupportBanner";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col font-serif bg-purple-50">
      <SiteHeader />
      <main className="flex-1">
        <FloatingSocialButtons />
        <div className="mx-auto max-w-[1200px]">
          {children}
        </div>
      </main>
      <SupportBanner />
      <div className="mx-auto max-w-[1200px]">
        <Footer />
      </div>
    </div>
  );
}

