import mongoose, { Document, Schema } from 'mongoose';

export type DemoStatus = 'draft' | 'published';

export interface IDemo extends Document {
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  demoUrl: string;
  videoUrl?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  recipientUserId: mongoose.Types.ObjectId;
  status: DemoStatus;
  adminMessage?: string;
  privateAdminNotes?: string;
  expiresAt?: Date;
  createdByAdminId: mongoose.Types.ObjectId;
  viewedByUserAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  toUserObject(): UserFacingDemo;
}

export interface UserFacingDemo {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  demoUrl: string;
  videoUrl?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  status: DemoStatus;
  adminMessage?: string;
  expiresAt?: Date;
  isExpired: boolean;
  viewedByUserAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DemoSchema = new Schema<IDemo>(
  {
    title: {
      type: String,
      required: [true, 'Demo title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Demo description is required'],
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Custom Solution',
    },
    thumbnail: {
      type: String,
      default: '',
      trim: true,
    },
    demoUrl: {
      type: String,
      required: [true, 'Demo URL is required'],
      trim: true,
    },
    videoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    attachmentName: {
      type: String,
      default: '',
      trim: true,
    },
    attachmentUrl: {
      type: String,
      default: '',
      trim: true,
    },
    recipientUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Target recipient user ID is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      index: true,
    },
    adminMessage: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Admin message cannot exceed 2000 characters'],
    },
    privateAdminNotes: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Admin private notes cannot exceed 2000 characters'],
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    createdByAdminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creating administrator ID is required'],
    },
    viewedByUserAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Method to format sanitized demo for regular client recipient (stripping privateAdminNotes)
DemoSchema.methods.toUserObject = function (): UserFacingDemo {
  const isExpired = Boolean(this.expiresAt && new Date(this.expiresAt).getTime() < Date.now());

  return {
    _id: this._id.toString(),
    title: this.title,
    description: this.description,
    category: this.category,
    thumbnail: this.thumbnail || '',
    demoUrl: isExpired ? '' : this.demoUrl, // Disable active link if expired
    videoUrl: this.videoUrl || '',
    attachmentName: this.attachmentName || '',
    attachmentUrl: this.attachmentUrl || '',
    status: this.status,
    adminMessage: this.adminMessage || '',
    expiresAt: this.expiresAt || undefined,
    isExpired,
    viewedByUserAt: this.viewedByUserAt || undefined,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Demo = mongoose.model<IDemo>('Demo', DemoSchema);
