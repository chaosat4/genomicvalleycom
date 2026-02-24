import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILibraryPreparationItem {
  kitRef: Types.ObjectId;
  price: number;
}

export interface IBulkDiscountCategory {
  name: string;
  minSample: number;
  maxSample: number;
  discount: number;
}

export interface IPriceConfiguration extends Document {
  version: string;
  isActive: boolean;
  
  // Basic services
  extraction: number;
  sampleQC: number;
  libraryQC: number;
  serviceCost: number;
  logistics: number;
  
  // Library preparation
  libraryPreparation: ILibraryPreparationItem[];
  
  // Sequencing per GB
  sequencingPerGb: {
    illumina: number;
    mgi: number;
    nanopore: number;
    pacbio: number;
    hic: number;
  };
  
  // Genome assembly per sample
  genomeAssemblyPerSample: {
    illumina: number;
    mgi: number;
    nanopore: number;
    pacbio: number;
    hic: number;
  };
  
  // Data analysis
  dataAnalysis: {
    standard: number;
    interpretation: number;
  };
  
  // Business rules
  profitPercentage: number;
  gstPercentage: number;
  
  bulkDiscount: {
    categories: IBulkDiscountCategory[];
  };
  
  additionalDiscount: number;
  
  updatedBy?: Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const LibraryPreparationSchema: Schema = new Schema({
  kitRef: { type: Schema.Types.ObjectId, ref: 'Kit', required: true },
  price: { type: Number, required: true, min: 0 },
});

const BulkDiscountCategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  minSample: { type: Number, required: true, min: 0 },
  maxSample: { type: Number, required: true, min: 0 },
  discount: { type: Number, required: true, min: 0, max: 100 },
});

const PriceConfigurationSchema: Schema = new Schema({
  version: {
    type: String,
    default: '1.0.0',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Basic services
  extraction: { type: Number, default: 0 },
  sampleQC: { type: Number, default: 0 },
  libraryQC: { type: Number, default: 0 },
  serviceCost: { type: Number, default: 0 },
  logistics: { type: Number, default: 0 },
  
  // Library preparation
  libraryPreparation: [LibraryPreparationSchema],
  
  // Sequencing per GB
  sequencingPerGb: {
    illumina: { type: Number, default: 0 },
    mgi: { type: Number, default: 0 },
    nanopore: { type: Number, default: 0 },
    pacbio: { type: Number, default: 0 },
    hic: { type: Number, default: 0 },
  },
  
  // Genome assembly per sample
  genomeAssemblyPerSample: {
    illumina: { type: Number, default: 0 },
    mgi: { type: Number, default: 0 },
    nanopore: { type: Number, default: 0 },
    pacbio: { type: Number, default: 0 },
    hic: { type: Number, default: 0 },
  },
  
  // Data analysis
  dataAnalysis: {
    standard: { type: Number, default: 0 },
    interpretation: { type: Number, default: 0 },
  },
  
  // Business rules
  profitPercentage: { type: Number, default: 0 },
  gstPercentage: { type: Number, default: 18 },
  
  bulkDiscount: {
    categories: [BulkDiscountCategorySchema],
  },
  
  additionalDiscount: { type: Number, default: 0 },
  
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Ensure only one active price configuration
PriceConfigurationSchema.pre('save', async function() {
  if (this.isActive) {
    const Model = this.constructor as any;
    await Model.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
});

export default mongoose.models.PriceConfiguration || mongoose.model<IPriceConfiguration>('PriceConfiguration', PriceConfigurationSchema);
