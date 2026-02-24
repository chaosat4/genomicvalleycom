import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IServiceItem {
  number: string;
  title: string;
  details: string[];
  kitRef?: Types.ObjectId;
  kitName?: string;
  kitCode?: string;
  priceOverride?: number;
}

export interface IMainContent {
  contentTitle: string;
  contentDescription: string;
  leftBox: {
    title: string;
    description: string;
  };
  servicesHeading: string;
  benefitsHeading: string;
  servicesList: IServiceItem[];
  benefits: string[];
}

export interface IService extends Document {
  documentId: string;
  categoryName: 'diagnostic' | 'research';
  order: number;
  status: 'published' | 'draft' | 'archived';
  stockStatus: 'in_stock' | 'out_of_stock' | 'limited';
  mainContent: IMainContent;
  createdBy?: Types.ObjectId;
  lastModifiedBy?: Types.ObjectId;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceItemSchema: Schema = new Schema({
  number: { type: String, required: true },
  title: { type: String, required: true },
  details: [{ type: String }],
  kitRef: { type: Schema.Types.ObjectId, ref: 'Kit' },
  kitName: { type: String },
  kitCode: { type: String },
  priceOverride: { type: Number },
});

const MainContentSchema: Schema = new Schema({
  contentTitle: { type: String, required: true },
  contentDescription: { type: String, required: true },
  leftBox: {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  servicesHeading: { type: String, required: true },
  benefitsHeading: { type: String, required: true },
  servicesList: [ServiceItemSchema],
  benefits: [{ type: String }],
});

const ServiceSchema: Schema = new Schema({
  documentId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  categoryName: {
    type: String,
    enum: ['diagnostic', 'research'],
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'draft',
  },
  stockStatus: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'limited'],
    default: 'in_stock',
  },
  mainContent: {
    type: MainContentSchema,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  lastModifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  version: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

ServiceSchema.index({ categoryName: 1, status: 1 });
ServiceSchema.index({ order: 1 });

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
