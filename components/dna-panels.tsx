'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Panel {
  _id: string;
  documentId: string;
  name: string;
  geneCount: number;
  category: 'human' | 'pro' | 'ultra';
  order: number;
}

interface GroupedPanels {
  human: Panel[];
  pro: Panel[];
  ultra: Panel[];
}

const TAB_LABELS: Record<keyof GroupedPanels, string> = {
  human: 'Human DNA Panels',
  pro: 'DNA Pro Panels',
  ultra: 'DNA Ultra Panels',
};

const CAPTION: Record<keyof GroupedPanels, string> = {
  human: 'Available Human DNA Panels',
  pro: 'Available DNA Pro Panels',
  ultra: 'Available DNA Ultra Panels',
};

const COL_LABEL: Record<keyof GroupedPanels, string> = {
  human: 'Panel Name',
  pro: 'Pro Panel Name',
  ultra: 'Ultra Panel Name',
};

function PanelTable({ panels, tab }: { panels: Panel[]; tab: keyof GroupedPanels }) {
  if (panels.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8 text-sm">
        No panels available in this category yet.
      </p>
    );
  }
  return (
    <Table>
      <TableCaption>{CAPTION[tab]}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[70%]">{COL_LABEL[tab]}</TableHead>
          <TableHead className="text-right">Number of Genes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {panels.map((panel) => (
          <TableRow key={panel._id ?? panel.documentId}>
            <TableCell className="font-medium">{panel.name}</TableCell>
            <TableCell className="text-right">{panel.geneCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function DNAPanels() {
  const [grouped, setGrouped] = useState<GroupedPanels | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/panels')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setGrouped(json.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []);

  const tabs: (keyof GroupedPanels)[] = ['human', 'pro', 'ultra'];

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-purple-600">
              DNA Panel Solutions
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Explore our comprehensive selection of DNA Panels designed to support clinical diagnostics, targeted
              therapy, and advanced genetic research. Our panels include targeted gene analyses for various cancers,
              inherited diseases, and solid tumors, providing precise genetic insights crucial for patient care and
              personalized medicine.
            </p>
            <p className="text-lg text-gray-700">
              Each panel is curated to cover relevant genes associated with specific conditions, facilitating accurate
              detection and informed clinical decisions.
            </p>
          </div>

          {error && (
            <p className="text-center text-red-500 text-sm mb-6">
              Failed to load panel data. Please refresh the page.
            </p>
          )}

          <Tabs defaultValue="human" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-purple-200">
              {tabs.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="text-sm md:text-base">
                  {TAB_LABELS[tab]}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-purple-600">{TAB_LABELS[tab]}</h2>
                  <div className="overflow-x-auto">
                    {grouped === null && !error ? (
                      // Skeleton loader
                      <div className="space-y-3 animate-pulse">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex justify-between">
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="h-4 bg-gray-200 rounded w-8" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <PanelTable panels={grouped?.[tab] ?? []} tab={tab} />
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
