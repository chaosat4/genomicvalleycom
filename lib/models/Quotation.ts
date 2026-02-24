import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFormData {
  servicesRequired: string;
  serviceName: string;
  speciesName: string;
  speciesNameOther?: string;
  tissueName: string;
  tissueNameOther?: string;
  numberOfSamples: number;
  readRequired?: number;
  readRequiredOther?: string;
  basesRequired?: number;
  basesRequiredOther?: string;
  kitName?: string;
  code?: string;
  readLength: string;
  readLengthOther?: string;
  sequencingPlatform: string;
  dataAnalysis: string;
  panel?: string[];
  shortRead?: string;
  longRead?: string;
  shortReadBaseRequired?: number;
  longReadBaseRequired?: number;
  hicBaseRequired?: number;
}

export interface IUserInfo {
  name: string;
  email: string;
  phone: string;
  institution: string;
  address: string;
}

export interface IServiceInfo {
  title: string;
  category: string;
}

export interface IPricing {
  priceBeforeGST: number;
  totalPrice: number;
  gstPercentage: number;
  bulkDiscount: number;
  logistics: number;
}

export interface IQuotation extends Document {
  quotationNumber: string;
  batchNumber: string;
  
  userId?: Types.ObjectId;
  userInfo: IUserInfo;
  
  serviceId?: Types.ObjectId;
  serviceInfo: IServiceInfo;
  
  formData: IFormData;
  pricing: IPricing;
  
  pdfUrl: string;
  pdfFilename: string;
  
  status: 'generated' | 'sent' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  validityDays: number;
}

const UserInfoSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  institution: { type: String, required: true },
  address: { type: String, required: true },
});

const ServiceInfoSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
});

const FormDataSchema: Schema = new Schema({
  servicesRequired: { type: String, required: true },
  serviceName: { type: String, required: true },
  speciesName: { type: String, required: true },
  speciesNameOther: { type: String },
  tissueName: { type: String, required: true },
  tissueNameOther: { type: String },
  numberOfSamples: { type: Number, required: true },
  readRequired: { type: Number },
  readRequiredOther: { type: String },
  basesRequired: { type: Number },
  basesRequiredOther: { type: String },
  kitName: { type: String },
  code: { type: String },
  readLength: { type: String, required: true },
  readLengthOther: { type: String },
  sequencingPlatform: { type: String, required: true },
  dataAnalysis: { type: String, required: true },
  panel: [{ type: String }],
  shortRead: { type: String },
  longRead: { type: String },
  shortReadBaseRequired: { type: Number },
  longReadBaseRequired: { type: Number },
  hicBaseRequired: { type: Number },
});

const PricingSchema: Schema = new Schema({
  priceBeforeGST: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  gstPercentage: { type: Number, required: true },
  bulkDiscount: { type: Number, default: 0 },
  logistics: { type: Number, default: 0 },
});

const QuotationSchema: Schema = new Schema({
  quotationNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  batchNumber: {
    type: String,
    required: true,
  },
  
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  userInfo: {
    type: UserInfoSchema,
    required: true,
  },
  
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
  },
  serviceInfo: {
    type: ServiceInfoSchema,
    required: true,
  },
  
  formData: {
    type: FormDataSchema,
    required: true,
  },
  pricing: {
    type: PricingSchema,
    required: true,
  },
  
  pdfUrl: {
    type: String,
    required: true,
  },
  pdfFilename: {
    type: String,
    required: true,
  },
  
  status: {
    type: String,
    enum: ['generated', 'sent', 'expired'],
    default: 'generated',
  },
  
  expiresAt: {
    type: Date,
    required: true,
  },
  
  validityDays: {
    type: Number,
    default: 30,
  },
}, {
  timestamps: true,
});

QuotationSchema.index({ userId: 1 });
QuotationSchema.index({ serviceId: 1 });
QuotationSchema.index({ status: 1 });
QuotationSchema.index({ createdAt: -1 });

export default mongoose.models.Quotation || mongoose.model<IQuotation>('Quotation', QuotationSchema);
