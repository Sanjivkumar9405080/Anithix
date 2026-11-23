import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'user' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isEmailVerified: boolean;
  accountStatus: 'active' | 'suspended';
  profileImage?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  organizationType?: string;
  location?: string;
  website?: string;
  bio?: string;
  interests?: string[];
  createdAt: Date;
  updatedAt: Date;
  calculateProfileCompletion(): number;
  toSafeObject(): SafeUser;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  accountStatus: 'active' | 'suspended';
  profileImage?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  organizationType?: string;
  location?: string;
  website?: string;
  bio?: string;
  interests?: string[];
  profileCompletion: number;
  createdAt: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email format'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Do not include in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    profileImage: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
      maxlength: [30, 'Phone number cannot exceed 30 characters'],
    },
    company: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    jobTitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    organizationType: {
      type: String,
      default: '',
      enum: ['', 'Business', 'School', 'College', 'Hospital', 'Agency', 'Startup', 'Other'],
    },
    location: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    website: {
      type: String,
      default: '',
      trim: true,
      maxlength: [250, 'Website URL cannot exceed 250 characters'],
    },
    bio: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    interests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to compute realistic profile completion percentage (0 - 100%)
UserSchema.methods.calculateProfileCompletion = function (): number {
  let score = 0;
  if (this.name && this.name.trim().length >= 2) score += 15;
  if (this.email && this.isEmailVerified) score += 15;
  if (this.profileImage && this.profileImage.trim().length > 0) score += 15;
  if (this.phone && this.phone.trim().length > 0) score += 10;
  if (this.company && this.company.trim().length > 0) score += 10;
  if (this.jobTitle && this.jobTitle.trim().length > 0) score += 10;
  if (this.organizationType && this.organizationType.trim().length > 0) score += 10;
  if (this.location && this.location.trim().length > 0) score += 5;
  if (this.bio && this.bio.trim().length > 0) score += 5;
  if (this.interests && this.interests.length > 0) score += 5;
  return Math.min(score, 100);
};

// Method to return safe public user object (stripping password hash & internal secrets)
UserSchema.methods.toSafeObject = function (): SafeUser {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role || 'user',
    isEmailVerified: this.isEmailVerified,
    accountStatus: this.accountStatus,
    profileImage: this.profileImage || '',
    phone: this.phone || '',
    company: this.company || '',
    jobTitle: this.jobTitle || '',
    organizationType: this.organizationType || '',
    location: this.location || '',
    website: this.website || '',
    bio: this.bio || '',
    interests: this.interests || [],
    profileCompletion: this.calculateProfileCompletion(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const User = mongoose.model<IUser>('User', UserSchema);
