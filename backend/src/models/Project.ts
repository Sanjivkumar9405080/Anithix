import mongoose, { Document, Schema } from 'mongoose';

export type ProjectStatus = 'draft' | 'published';

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  technologies: string[];
  thumbnail: string;
  gallery?: string[];
  liveDemoUrl?: string;
  sourceCodeUrl?: string;
  featured: boolean;
  status: ProjectStatus;
  order: number;
  mockupType?: string;
  surfaceTheme?: string;
  badge?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Detailed description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Business Software',
      index: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      trim: true,
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
    liveDemoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    sourceCodeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    mockupType: {
      type: String,
      default: '',
    },
    surfaceTheme: {
      type: String,
      default: 'violet-lavender',
    },
    badge: {
      type: String,
      default: 'Project Concept',
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ status: 1, order: 1, createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
