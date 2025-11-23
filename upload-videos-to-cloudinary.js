/**
 * Script to upload videos to Cloudinary
 * Run with: node upload-videos-to-cloudinary.js
 *
 * Prerequisites:
 * 1. Install cloudinary: npm install cloudinary
 * 2. Set your API credentials in .env file
 */

import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = join(__dirname, ".env");
const envContent = readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, value] = line.split("=");
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const CLOUD_NAME = envVars.VITE_CLOUDINARY_CLOUD_NAME;
const API_KEY = envVars.VITE_CLOUDINARY_API_KEY;

// You need to get your API_SECRET from Cloudinary dashboard
// For security, don't commit this - add it to .env as VITE_CLOUDINARY_API_SECRET
const API_SECRET = envVars.VITE_CLOUDINARY_API_SECRET || "YOUR_API_SECRET_HERE";

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

// Videos to upload
const videos = [
  {
    path: "public/videos/bg-zipp.mp4",
    publicId: "zipp/bg-zipp",
    displayName: "Background Hero Video",
  },
  {
    path: "public/videos/bg1-zip.mp4",
    publicId: "zipp/bg1-zip",
    displayName: "Intelligent Section Video",
  },
  {
    path: "public/videos/bg2-zip.mp4",
    publicId: "zipp/bg2-zip",
    displayName: "Scale Section Video",
  },
  {
    path: "public/videos/bg3-zip.mp4",
    publicId: "zipp/bg3-zip",
    displayName: "Adapt Section Video",
  },
];

/**
 * Upload a video to Cloudinary
 */
async function uploadVideo(video) {
  try {
    console.log(`\n📤 Uploading ${video.displayName}...`);
    console.log(`   Path: ${video.path}`);

    const result = await cloudinary.uploader.upload(video.path, {
      resource_type: "video",
      public_id: video.publicId,
      folder: "zipp",
      overwrite: true,
      // Optimize video for web
      transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
    });

    console.log(`✅ Successfully uploaded!`);
    console.log(`   Public ID: ${result.public_id}`);
    console.log(`   URL: ${result.secure_url}`);
    console.log(`   Duration: ${result.duration}s`);
    console.log(`   Size: ${(result.bytes / 1024 / 1024).toFixed(2)} MB`);

    return result;
  } catch (error) {
    console.error(`❌ Failed to upload ${video.displayName}:`, error.message);
    throw error;
  }
}

/**
 * Main upload function
 */
async function uploadAllVideos() {
  console.log("🚀 Starting Cloudinary video upload...");
  console.log(`📁 Cloud Name: ${CLOUD_NAME}`);
  console.log(`🔑 API Key: ${API_KEY}`);

  if (!API_SECRET || API_SECRET === "YOUR_API_SECRET_HERE") {
    console.error(
      "\n❌ ERROR: Please set your VITE_CLOUDINARY_API_SECRET in the .env file"
    );
    console.error("You can find your API Secret in your Cloudinary Dashboard:");
    console.error(
      "https://console.cloudinary.com/settings/c-60hHf3QP3snEyyfqmbR2B2YMakg/api-keys"
    );
    process.exit(1);
  }

  const results = [];

  for (const video of videos) {
    try {
      const result = await uploadVideo(video);
      results.push(result);
    } catch (error) {
      console.error(`Skipping ${video.displayName} due to error`);
    }
  }

  console.log("\n✨ Upload Summary:");
  console.log(`   Total videos: ${videos.length}`);
  console.log(`   Successful: ${results.length}`);
  console.log(`   Failed: ${videos.length - results.length}`);

  if (results.length === videos.length) {
    console.log("\n🎉 All videos uploaded successfully!");
    console.log(
      "Your videos are now hosted on Cloudinary and optimized for web delivery."
    );
  }
}

// Run the upload
uploadAllVideos().catch((error) => {
  console.error("\n❌ Upload process failed:", error);
  process.exit(1);
});
