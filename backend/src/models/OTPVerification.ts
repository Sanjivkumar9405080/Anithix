import mongoose, { Document, Schema } from 'mongoose';

export type OtpPurpose = 'registration' | 'login';

export interface IOTPVerification extends Document {
  email: string;
  otpHash: string;
  purpose: OtpPurpose;
  metadata?: Record<string, any>;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  createdAt: Date;
}

const OTPVerificationSchema = new Schema<IOTPVerification>(
  {
    email: {
      type: String,
      required: [true, 'Email is required for OTP verification'],
      lowercase: true,
      trim: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: [true, 'Hashed OTP is required'],
    },
    purpose: {
      type: String,
      enum: ['registration', 'login'],
      required: [true, 'OTP purpose is required'],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL index to automatically purge expired records
    },
    attempts: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index for querying active OTP by email and purpose
OTPVerificationSchema.index({ email: 1, purpose: 1, verified: 1 });

export const OTPVerification = mongoose.model<IOTPVerification>(
  'OTPVerification',
  OTPVerificationSchema
);
