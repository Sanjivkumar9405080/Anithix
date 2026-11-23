import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

export interface ImageValidationResult {
  valid: boolean;
  ext?: string;
  mime?: string;
  error?: string;
}

/**
 * Validates file magic bytes (signatures) to ensure genuine image content,
 * preventing MIME spoofing and arbitrary file upload exploits.
 */
export function validateImageMagicBytes(buffer: Buffer): ImageValidationResult {
  if (!buffer || buffer.length < 12) {
    return { valid: false, error: 'File buffer is too small to be a valid image.' };
  }

  // 1. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, ext: 'png', mime: 'image/png' };
  }

  // 2. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: 'jpg', mime: 'image/jpeg' };
  }

  // 3. WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, ext: 'webp', mime: 'image/webp' };
  }

  // 4. GIF: 47 49 46 38
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return { valid: true, ext: 'gif', mime: 'image/gif' };
  }

  return {
    valid: false,
    error: 'Unsupported image format. Allowed formats: PNG, JPG/JPEG, WebP, GIF.',
  };
}

/**
 * Ensures the uploads directory exists on disk when the filesystem is writable.
 */
export function ensureUploadsDir(): string {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
}

/**
 * Saves an image buffer to disk or Cloudinary/Data URI when running on serverless environments.
 */
export async function saveAvatarFile(userId: string, buffer: Buffer, ext: string): Promise<string> {
  const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

  // 1. If Cloudinary credentials are configured, upload to Cloudinary
  if (env.CLOUDINARY_CLOUD_NAME && (env.CLOUDINARY_API_KEY || env.CLOUDINARY_URL)) {
    try {
      const dataUri = `data:${mime};base64,${buffer.toString('base64')}`;
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: dataUri,
            folder: 'anthix_avatars',
            public_id: `avatar-${userId}-${Date.now()}`,
          }),
        }
      );
      const cloudData: any = await cloudRes.json();
      if (cloudData && typeof cloudData === 'object' && cloudData.secure_url) {
        return cloudData.secure_url;
      }
    } catch (cloudErr) {
      console.warn('[Cloudinary Upload Warning]:', cloudErr);
    }
  }

  // 2. Try writing to local disk (standard Node environment)
  try {
    const dir = ensureUploadsDir();
    const filename = `avatar-${userId}-${Date.now()}.${ext}`;
    const filepath = path.join(dir, filename);

    fs.writeFileSync(filepath, buffer);
    return `/uploads/avatars/${filename}`;
  } catch (err: any) {
    // 3. Fallback for read-only serverless environments (Vercel Lambda)
    console.warn(`[Avatar Storage Notice]: Local filesystem is read-only (${err.code || err.message}). Storing as inline data URI.`);
    return `data:${mime};base64,${buffer.toString('base64')}`;
  }
}

/**
 * Deletes an old local avatar file if it exists
 */
export function deleteAvatarFile(avatarPath?: string): void {
  if (!avatarPath || !avatarPath.startsWith('/uploads/avatars/')) return;

  try {
    const filename = path.basename(avatarPath);
    const fullPath = path.join(process.cwd(), 'uploads', 'avatars', filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    // Ignore cleanup warnings on ephemeral/read-only filesystems
  }
}
