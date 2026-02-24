import mongoose, { Schema, Document } from 'mongoose';

export interface IKit extends Document {
  name: string;
  code: string;
  description?: string;
  price: number;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const KitSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    default: 'library-prep',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

KitSchema.index({ isActive: 1 });
KitSchema.index({ category: 1 });

export default mongoose.models.Kit || mongoose.model<IKit>('Kit', KitSchema);
