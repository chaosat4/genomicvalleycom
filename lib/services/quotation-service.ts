import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export interface QuotationFormData {
  servicesRequired: string;
  serviceName: string;
  speciesName: string;
  tissueName: string;
  numberOfSamples: number;
  readRequired?: number;
  basesRequired?: number;
  kitName?: string;
  sequencingPlatform: string;
  dataAnalysis: string;
  shortRead?: string;
  longRead?: string;
  shortReadBaseRequired?: number;
  longReadBaseRequired?: number;
  hicBaseRequired?: number;
}

export interface QuotationPricing {
  priceBeforeGST: number;
  totalPrice: number;
  gstPercentage: number;
  bulkDiscount: number;
  logistics: number;
}

export function calculateQuotationPrice(
  serviceTitle: string,
  formData: QuotationFormData,
  priceConfig: any
): QuotationPricing {
  let totalPrice = 0;

  if (formData.servicesRequired?.includes("Extraction")) {
    totalPrice += Number(priceConfig.extraction) * Number(formData.numberOfSamples) || 0;
  }

  if (formData.servicesRequired?.includes("Extraction") || formData.servicesRequired?.includes("Library Preparation")) {
    totalPrice += Number(priceConfig.sampleQC) * Number(formData.numberOfSamples) || 0;
  }

  if (formData.servicesRequired?.includes("Library Preparation")) {
    const kitPrice = priceConfig.libraryPreparation?.find(
      (k: any) => k.kitName === formData.kitName || k.kitRef?.name === formData.kitName
    )?.price || 0;

    if (kitPrice) {
      totalPrice += Number(kitPrice) * Number(formData.numberOfSamples) || 0;
    }

    totalPrice += Number(priceConfig.serviceCost) * Number(formData.numberOfSamples) || 0;
    totalPrice += Number(priceConfig.libraryQC) * Number(formData.numberOfSamples) || 0;
  }

  if (formData.servicesRequired?.includes("Library-QC")) {
    totalPrice += Number(priceConfig.libraryQC) || 0;
  }

  if (formData.servicesRequired?.includes("Sequencing") && serviceTitle !== "Genome Assembly") {
    const sampleSize = Number(formData.numberOfSamples) || 0;
    let platformPrice = 0;
    const sequencingPrices = priceConfig.sequencingPerGb || {};

    if (formData.sequencingPlatform === "Illumina") platformPrice = Number(sequencingPrices.illumina) || 0;
    if (formData.sequencingPlatform === "MGI") platformPrice = Number(sequencingPrices.mgi) || 0;
    if (formData.sequencingPlatform === "PacBio") platformPrice = Number(sequencingPrices.pacbio) || 0;
    if (formData.sequencingPlatform === "Nanopore") platformPrice = Number(sequencingPrices.nanopore) || 0;

    let basesRequired = Number(formData.basesRequired) || 0;
    const readsRequired = Number(formData.readRequired) || 0;
    if (basesRequired === 0 && readsRequired > 0) {
      basesRequired = (readsRequired * 150) / 1000;
    }

    totalPrice += platformPrice * basesRequired * sampleSize;
  }

  if (serviceTitle === "Genome Assembly") {
    const sampleSize = Number(formData.numberOfSamples) || 0;
    const shortReadBase = Number(formData.shortReadBaseRequired) || 0;
    const longReadBase = Number(formData.longReadBaseRequired) || 0;
    const hicBase = Number(formData.hicBaseRequired) || 0;
    const assemblyPrices = priceConfig.genomeAssemblyPerSample || {};

    if (formData.shortRead === "Illumina") totalPrice += Number(assemblyPrices.illumina) * shortReadBase * sampleSize;
    if (formData.shortRead === "MGI") totalPrice += Number(assemblyPrices.mgi) * shortReadBase * sampleSize;
    if (formData.longRead === "PacBio") totalPrice += Number(assemblyPrices.pacbio) * longReadBase * sampleSize;
    if (formData.longRead === "Nanopore") totalPrice += Number(assemblyPrices.nanopore) * longReadBase * sampleSize;

    totalPrice += Number(assemblyPrices.hic) * hicBase * sampleSize;
  }

  if (formData.servicesRequired?.includes("Data Analysis")) {
    if (formData.dataAnalysis === "standard") {
      totalPrice += Number(priceConfig.dataAnalysis?.standard) * Number(formData.numberOfSamples) || 0;
    }
    if (formData.dataAnalysis === "advanced") {
      totalPrice += (Number(priceConfig.dataAnalysis?.standard) + Number(priceConfig.dataAnalysis?.interpretation)) * Number(formData.numberOfSamples) || 0;
    }
  }

  const logisticsCost = formData.servicesRequired === "Data Analysis" ? 0 : Number(priceConfig.logistics) || 0;
  totalPrice += logisticsCost;

  let bulkDiscount = 0;
  const numSamples = Number(formData.numberOfSamples) || 0;
  if (priceConfig.bulkDiscount?.categories) {
    const discountCategory = priceConfig.bulkDiscount.categories.find(
      (category: { minSample: number; maxSample: number; discount: number }) =>
        numSamples >= category.minSample && numSamples <= category.maxSample
    );
    if (discountCategory) {
      totalPrice = totalPrice * (1 - Number(discountCategory.discount) / 100);
      bulkDiscount = discountCategory.discount;
    }
  }

  if (priceConfig.additionalDiscount) {
    totalPrice = totalPrice * (1 - Number(priceConfig.additionalDiscount) / 100);
  }

  totalPrice = totalPrice * (1 + Number(priceConfig.profitPercentage) / 100);
  const priceBeforeGST = Math.round(totalPrice);
  totalPrice = totalPrice * (1 + Number(priceConfig.gstPercentage) / 100);
  totalPrice = Math.round(totalPrice);

  return {
    priceBeforeGST,
    totalPrice,
    gstPercentage: priceConfig.gstPercentage || 18,
    bulkDiscount,
    logistics: logisticsCost,
  };
}

export function generateQuotationNumber(): string {
  const shortId = uuidv4().substring(0, 8);
  return `GVPBQ_${format(new Date(), "yyyyMMdd")}_${shortId}`;
}

export function generateBatchNumber(formData: QuotationFormData): string {
  const speciesMap: Record<string, string> = {
    human: "HUM",
    plant: "PLT",
    animal: "ANM",
    bacteria: "BAC",
  };

  const tissueMap: Record<string, string> = {
    blood: "BLD",
    root: "ROT",
    stem: "STM",
    skin: "SKN",
  };

  const speciesCode = speciesMap[formData.speciesName] || "OTH";
  const tissueCode = tissueMap[formData.tissueName] || "OTH";
  const date = format(new Date(), "yyyyMM");
  const random = uuidv4().replace(/-/g, "").slice(0, 6).toUpperCase();

  return `GVL-${speciesCode}-${tissueCode}-${date}-${random}`;
}
