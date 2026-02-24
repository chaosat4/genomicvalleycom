import mongoose, { Schema, Document } from 'mongoose';

export type PanelCategory = 'human' | 'pro' | 'ultra';

export interface IPanel extends Document {
  documentId: string;
  name: string;
  geneCount: number;
  genes?: string;       // optional: comma-separated gene names / description
  category: PanelCategory;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PanelSchema: Schema = new Schema({
  documentId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  geneCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  genes: {
    type: String,
  },
  category: {
    type: String,
    enum: ['human', 'pro', 'ultra'],
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

PanelSchema.index({ category: 1, order: 1 });
PanelSchema.index({ isActive: 1 });

export default mongoose.models.Panel || mongoose.model<IPanel>('Panel', PanelSchema);
