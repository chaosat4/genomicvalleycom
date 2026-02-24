import { z } from "zod";

export const serviceItemSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  details: z.array(z.string().min(1)).default([]),
  kitRef: z.string().optional(),
  kitName: z.string().optional(),
  kitCode: z.string().optional(),
  priceOverride: z.number().nonnegative().optional(),
});

export const serviceSchema = z.object({
  documentId: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  categoryName: z.enum(["diagnostic", "research"]),
  order: z.number().int().nonnegative().default(0),
  status: z.enum(["published", "draft", "archived"]).default("draft"),
  stockStatus: z.enum(["in_stock", "out_of_stock", "limited"]).default("in_stock"),
  mainContent: z.object({
    contentTitle: z.string().min(1),
    contentDescription: z.string().min(1),
    leftBox: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    }),
    servicesHeading: z.string().min(1),
    benefitsHeading: z.string().min(1),
    servicesList: z.array(serviceItemSchema).default([]),
    benefits: z.array(z.string().min(1)).default([]),
  }),
});

export const panelSchema = z.object({
  documentId: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  geneCount: z.number().int().nonnegative(),
  genes: z.string().optional(),
  category: z.enum(['human', 'pro', 'ultra']),
  order: z.number().int().default(0),
  isActive: z.boolean().optional(),
});

export const kitSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const pricingSchema = z.object({
  extraction: z.number().nonnegative().default(0),
  sampleQC: z.number().nonnegative().default(0),
  libraryQC: z.number().nonnegative().default(0),
  serviceCost: z.number().nonnegative().default(0),
  logistics: z.number().nonnegative().default(0),
  libraryPreparation: z.array(
    z.object({ kitRef: z.string().min(1), price: z.number().nonnegative() })
  ).default([]),
  sequencingPerGb: z.object({
    illumina: z.number().nonnegative().default(0),
    mgi: z.number().nonnegative().default(0),
    nanopore: z.number().nonnegative().default(0),
    pacbio: z.number().nonnegative().default(0),
    hic: z.number().nonnegative().default(0),
  }),
  genomeAssemblyPerSample: z.object({
    illumina: z.number().nonnegative().default(0),
    mgi: z.number().nonnegative().default(0),
    nanopore: z.number().nonnegative().default(0),
    pacbio: z.number().nonnegative().default(0),
    hic: z.number().nonnegative().default(0),
  }),
  dataAnalysis: z.object({
    standard: z.number().nonnegative().default(0),
    interpretation: z.number().nonnegative().default(0),
  }),
  profitPercentage: z.number().min(0).max(100).default(0),
  gstPercentage: z.number().min(0).max(100).default(18),
  bulkDiscount: z.object({
    categories: z.array(
      z.object({
        name: z.string().min(1),
        minSample: z.number().int().nonnegative(),
        maxSample: z.number().int().nonnegative(),
        discount: z.number().min(0).max(100),
      })
    ).default([]),
  }).default({ categories: [] }),
  additionalDiscount: z.number().min(0).max(100).default(0),
});

export const quotationRequestSchema = z.object({
  serviceTitle: z.string().min(1),
  formData: z.object({
    servicesRequired: z.string().min(1),
    serviceName: z.string().min(1),
    speciesName: z.string().min(1),
    tissueName: z.string().min(1),
    numberOfSamples: z.number().int().positive(),
    readRequired: z.number().optional(),
    basesRequired: z.number().optional(),
    kitName: z.string().optional(),
    sequencingPlatform: z.string().min(1),
    dataAnalysis: z.string().min(1),
    shortRead: z.string().optional(),
    longRead: z.string().optional(),
    shortReadBaseRequired: z.number().optional(),
    longReadBaseRequired: z.number().optional(),
    hicBaseRequired: z.number().optional(),
  }),
  userInfo: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(6),
    institution: z.string().min(1),
    address: z.string().min(1),
  }),
});

export const callRequestSchema = z.object({
  phone: z.string().trim().regex(/^\+?[0-9]{10,15}$/),
});
