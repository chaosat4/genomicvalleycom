import { SiteHeader } from "@/components/site-header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
            <main className="flex-1">
                <div className="container mx-auto">
              {children}
            </div>
            </main>
      </div>
      </>
  );
}

