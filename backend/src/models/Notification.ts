import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType =
  | 'demo_shared'
  | 'demo_updated'
  | 'request_status'
  | 'system';

export interface INotification extends Document {
  recipientUserId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedDemoId?: mongoose.Types.ObjectId;
  relatedRequestId?: mongoose.Types.ObjectId;
  link?: string;
  readAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient user ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['demo_shared', 'demo_updated', 'request_status', 'system'],
      default: 'system',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    relatedDemoId: {
      type: Schema.Types.ObjectId,
      ref: 'Demo',
      default: null,
    },
    relatedRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
      default: null,
    },
    link: {
      type: String,
      default: '',
      trim: true,
    },
    readAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
