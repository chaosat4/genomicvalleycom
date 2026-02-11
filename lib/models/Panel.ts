import mongoose, { Schema, Document } from 'mongoose';

export interface IPanel extends Document {
  documentId: string;
  name: string;
  genes: string;
  category?: string;
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
  genes: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'cancer-genomics',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

PanelSchema.index({ isActive: 1 });

export default mongoose.models.Panel || mongoose.model<IPanel>('Panel', PanelSchema);
