import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Panel from '@/lib/models/Panel';
import { handleOptions, withCors } from '@/lib/api/cors';
import { requireAdmin } from '@/lib/api/admin-guard';

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

// All panels extracted from the original hardcoded DNAPanels component
const SEED_PANELS = [
  // ── Human DNA Panels ────────────────────────────────────────────────────
  { documentId: 'human-breast-cancer-panel',            name: 'Human Breast Cancer Panel',                     geneCount: 93,  category: 'human', order: 1  },
  { documentId: 'human-colorectal-cancer-panel',        name: 'Human Colorectal Cancer Panel',                 geneCount: 71,  category: 'human', order: 2  },
  { documentId: 'human-myeloid-neoplasms-panel',        name: 'Human Myeloid Neoplasms Panel',                 geneCount: 141, category: 'human', order: 3  },
  { documentId: 'human-lung-cancer-panel',              name: 'Human Lung Cancer Panel',                       geneCount: 72,  category: 'human', order: 4  },
  { documentId: 'human-inherited-disease-panel',        name: 'Human Inherited Disease Panel',                 geneCount: 298, category: 'human', order: 5  },
  { documentId: 'human-comprehensive-cancer-panel',     name: 'Human Comprehensive Cancer Panel',              geneCount: 275, category: 'human', order: 6  },
  { documentId: 'human-actionable-solid-tumor-panel',   name: 'Human Actionable Solid Tumor Panel',            geneCount: 22,  category: 'human', order: 7  },
  { documentId: 'human-brca1-and-brca2-panel',          name: 'Human BRCA1 and BRCA2 Panel',                   geneCount: 2,   category: 'human', order: 8  },
  { documentId: 'human-brca1-and-brca2-plus-panel',     name: 'Human BRCA1 and BRCA2 Plus Panel',              geneCount: 6,   category: 'human', order: 9  },
  { documentId: 'human-hrr-panel',                      name: 'Human HRR Panel',                               geneCount: 15,  category: 'human', order: 10 },
  { documentId: 'human-tmb-and-msi-panel',              name: 'Human TMB and MSI Panel',                       geneCount: 486, category: 'human', order: 11 },

  // ── DNA Pro Panels ───────────────────────────────────────────────────────
  { documentId: 'pro-comprehensive-cancer-research-panel',          name: 'Comprehensive Cancer Research Panel',            geneCount: 225, category: 'pro', order: 1  },
  { documentId: 'pro-breast-cancer-research-panel',                 name: 'Breast Cancer Research Panel',                   geneCount: 54,  category: 'pro', order: 2  },
  { documentId: 'pro-colorectal-cancer-research-panel',             name: 'Colorectal Cancer Research Panel',               geneCount: 76,  category: 'pro', order: 3  },
  { documentId: 'pro-myeloid-neoplasms-research-panel',             name: 'Myeloid Neoplasms Research Panel',               geneCount: 164, category: 'pro', order: 4  },
  { documentId: 'pro-brain-cancer-research-panel',                  name: 'Brain Cancer Research Panel',                    geneCount: 50,  category: 'pro', order: 5  },
  { documentId: 'pro-lung-cancer-research-panel',                   name: 'Lung Cancer Research Panel',                     geneCount: 76,  category: 'pro', order: 6  },
  { documentId: 'pro-comprehensive-cancer-focus-panel',             name: 'Comprehensive Cancer Focus Panel',               geneCount: 164, category: 'pro', order: 7  },
  { documentId: 'pro-breast-cancer-focus-panel',                    name: 'Breast Cancer Focus Panel',                      geneCount: 36,  category: 'pro', order: 8  },
  { documentId: 'pro-colorectal-cancer-focus-panel',                name: 'Colorectal Cancer Focus Panel',                  geneCount: 53,  category: 'pro', order: 9  },
  { documentId: 'pro-myeloid-neoplasms-focus-panel',                name: 'Myeloid Neoplasms Focus Panel',                  geneCount: 92,  category: 'pro', order: 10 },
  { documentId: 'pro-brain-cancer-focus-panel',                     name: 'Brain Cancer Focus Panel',                       geneCount: 26,  category: 'pro', order: 11 },
  { documentId: 'pro-lung-cancer-focus-panel',                      name: 'Lung Cancer Focus Panel',                        geneCount: 44,  category: 'pro', order: 12 },
  { documentId: 'pro-comprehensive-hereditary-cancer-research-panel', name: 'Comprehensive Hereditary Cancer Research Panel', geneCount: 287, category: 'pro', order: 13 },
  { documentId: 'pro-hereditary-breast-and-ovarian-cancer-panel',   name: 'Hereditary Breast and Ovarian Cancer Panel',     geneCount: 50,  category: 'pro', order: 14 },
  { documentId: 'pro-hereditary-colorectal-cancer-panel',           name: 'Hereditary Colorectal Cancer Panel',             geneCount: 44,  category: 'pro', order: 15 },
  { documentId: 'pro-hematologic-malignancy-panel',                 name: 'Hematologic Malignancy Panel',                   geneCount: 33,  category: 'pro', order: 16 },
  { documentId: 'pro-hereditary-prostate-cancer-panel',             name: 'Hereditary Prostate Cancer Panel',               geneCount: 23,  category: 'pro', order: 17 },
  { documentId: 'pro-hereditary-pancreatic-cancer-panel',           name: 'Hereditary Pancreatic Cancer Panel',             geneCount: 32,  category: 'pro', order: 18 },

  // ── DNA Ultra Panels ─────────────────────────────────────────────────────
  { documentId: 'ultra-breast-cancer-research-panel',     name: 'Breast Cancer Research Panel',     geneCount: 14, category: 'ultra', order: 1 },
  { documentId: 'ultra-colorectal-cancer-research-panel', name: 'Colorectal Cancer Research Panel', geneCount: 27, category: 'ultra', order: 2 },
  { documentId: 'ultra-human-lung-cancer-panel',          name: 'Human Lung Cancer Panel',          geneCount: 26, category: 'ultra', order: 3 },
] as const;

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    await connectDB();

    const now = new Date();
    const rawOps = SEED_PANELS.map(panel => ({
      updateOne: {
        filter: { documentId: panel.documentId },
        update: {
          $set: {
            ...panel,
            isActive: true,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        upsert: true,
      },
    }));

    // Use native collection write to avoid stale in-memory Mongoose schema dropping new fields.
    const result = await Panel.collection.bulkWrite(rawOps);

    return withCors(request, NextResponse.json({
      success: true,
      message: `Seeded ${SEED_PANELS.length} panels successfully`,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
    }));
  } catch (error) {
    console.error('Error seeding panels:', error);
    return withCors(request, NextResponse.json(
      { success: false, error: 'Failed to seed panels' },
      { status: 500 }
    ));
  }
}
