import mongoose, { Document, Schema } from 'mongoose';

export type ContactStatus = 'new' | 'in_progress' | 'replied' | 'closed';

export interface IContact extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  service: string;
  organization?: string;
  phone?: string;
  message: string;
  subject: string;
  status: ContactStatus;
  adminNotes?: string;
  archived?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address format'],
    },
    service: {
      type: String,
      required: [true, 'Service of interest is required'],
      default: 'Digital Solutions',
      trim: true,
      index: true,
    },
    organization: {
      type: String,
      trim: true,
      maxlength: [150, 'Organization name cannot exceed 150 characters'],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, 'Phone number cannot exceed 30 characters'],
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Project message/details are required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters long'],
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    subject: {
      type: String,
      trim: true,
      default: 'Project Inquiry',
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'replied', 'closed'],
      default: 'new',
      index: true,
    },
    adminNotes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [5000, 'Admin notes cannot exceed 5000 characters'],
    },
    archived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for search and filtering
ContactSchema.index({ status: 1, service: 1, createdAt: -1 });

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
