/**
 * Cloudinary utility functions
 * Generates optimized video URLs from Cloudinary
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

/**
 * Generate a Cloudinary video URL with optimizations
 * @param publicId - The public ID of the video in Cloudinary
 * @param options - Optional transformations
 * @returns Optimized Cloudinary video URL
 */
export function getCloudinaryVideoUrl(
  publicId: string,
  options?: {
    quality?: "auto" | "auto:best" | "auto:good" | "auto:eco" | "auto:low";
    format?: "auto" | "mp4" | "webm";
    width?: number;
    height?: number;
  }
): string {
  const {
    quality = "auto:good",
    format = "auto",
    width,
    height,
  } = options || {};

  let transformations = `q_${quality},f_${format}`;

  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;

  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transformations}/${publicId}`;
}

/**
 * Video public IDs mapping
 * Update these after uploading videos to Cloudinary
 */
export const VIDEO_IDS = {
  bgZipp: "zipp/zipp/bg-zipp",
  bg1Zip: "zipp/zipp/bg1-zip",
  bg2Zip: "zipp/zipp/bg2-zip",
  bg3Zip: "zipp/zipp/bg3-zip",
} as const;
