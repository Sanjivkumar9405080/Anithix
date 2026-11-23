import mongoose, { Document, Schema } from 'mongoose';

export type EmailDeliveryStatus = 'sent' | 'failed';

export interface IEmailActivity extends Document {
  recipient: string;
  recipientName?: string;
  subject: string;
  body: string;
  userId?: mongoose.Types.ObjectId;
  requestId?: mongoose.Types.ObjectId;
  sentBy?: mongoose.Types.ObjectId;
  status: EmailDeliveryStatus;
  messageId?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailActivitySchema = new Schema<IEmailActivity>(
  {
    recipient: {
      type: String,
      required: [true, 'Recipient email address is required'],
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid recipient email format'],
    },
    recipientName: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Email subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    body: {
      type: String,
      required: [true, 'Email body is required'],
      trim: true,
      maxlength: [10000, 'Email body cannot exceed 10000 characters'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
      default: null,
      index: true,
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      required: true,
      index: true,
    },
    messageId: {
      type: String,
      trim: true,
      default: '',
    },
    error: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

EmailActivitySchema.index({ recipient: 1, createdAt: -1 });

export const EmailActivity = mongoose.model<IEmailActivity>('EmailActivity', EmailActivitySchema);
