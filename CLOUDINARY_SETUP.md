# Cloudinary Video Setup Guide

This guide explains how to upload and use videos from Cloudinary in your Zipp landing page.

## ✅ What's Already Done

1. **Environment Variables**: Added Cloudinary configuration to `.env`

   - `VITE_CLOUDINARY_CLOUD_NAME=dakurlgt2`
   - `VITE_CLOUDINARY_API_KEY=60hHf3QP3snEyyfqmbR2B2YMakg`

2. **Utility Function**: Created `/src/utils/cloudinary.ts` for generating optimized video URLs

3. **Updated Components**: Modified all landing page components to use Cloudinary:
   - `Hero.tsx` - Uses `bg-zipp.mp4`
   - `IntelligentSection.tsx` - Uses `bg1-zip.mp4`
   - `ScaleSection.tsx` - Uses `bg2-zip.mp4`
   - `AdaptSection.tsx` - Uses `bg3-zip.mp4`

## 🔐 Required: Get Your API Secret

**IMPORTANT**: You need to add your Cloudinary API Secret to complete the setup.

1. Go to your Cloudinary Dashboard: https://console.cloudinary.com/
2. Navigate to Settings → API Keys (or direct link with your API key)
3. Copy your **API Secret** (keep it private!)
4. Add it to your `.env` file:

```env
VITE_CLOUDINARY_API_SECRET=your_api_secret_here
```

## 📤 Upload Videos to Cloudinary

Once you have your API Secret, run these commands:

```bash
# Install Cloudinary package (if not already installed)
npm install cloudinary

# Run the upload script
node upload-videos-to-cloudinary.js
```

The script will:

- Upload all 4 videos from `public/videos/` to Cloudinary
- Organize them in a `zipp` folder
- Apply automatic quality optimization
- Show progress and results

## 🎯 Videos Being Uploaded

| Local File    | Cloudinary Public ID | Used In Component   |
| ------------- | -------------------- | ------------------- |
| `bg-zipp.mp4` | `zipp/bg-zipp`       | Hero Section        |
| `bg1-zip.mp4` | `zipp/bg1-zip`       | Intelligent Section |
| `bg2-zip.mp4` | `zipp/bg2-zip`       | Scale Section       |
| `bg3-zip.mp4` | `zipp/bg3-zip`       | Adapt Section       |

## 🚀 Benefits of Using Cloudinary

✅ **Automatic Optimization**: Videos are compressed and optimized automatically  
✅ **Adaptive Streaming**: Best quality based on user's connection  
✅ **CDN Delivery**: Fast loading from servers closest to your users  
✅ **Format Conversion**: Automatic WebM for browsers that support it  
✅ **Reduced Bundle Size**: Videos aren't part of your deployment

## 🔧 Customizing Video Quality

Edit `/src/utils/cloudinary.ts` to adjust video transformations:

```typescript
const bgVideo = getCloudinaryVideoUrl(VIDEO_IDS.bgZipp, {
  quality: "auto:best", // Options: auto:best, auto:good, auto:eco, auto:low
  format: "auto", // Options: auto, mp4, webm
  width: 1920, // Optional: resize width
  height: 1080, // Optional: resize height
});
```

## 📝 Next Steps

1. ✅ Add `VITE_CLOUDINARY_API_SECRET` to `.env`
2. ✅ Run `npm install cloudinary`
3. ✅ Run `node upload-videos-to-cloudinary.js`
4. ✅ Test your site with `npm run dev`
5. ✅ Remove old videos from `public/videos/` to reduce deployment size (optional)

## 🆘 Troubleshooting

**Error: "Please set your VITE_CLOUDINARY_API_SECRET"**

- Make sure you added the API Secret to `.env` file
- Restart your development server after adding it

**Upload fails with authentication error**

- Double-check your API Key and Secret are correct
- Ensure there are no extra spaces in the `.env` file

**Videos not loading**

- Check browser console for errors
- Verify the Cloudinary public IDs match in `cloudinary.ts`
- Ensure videos were successfully uploaded to Cloudinary

## 📚 Additional Resources

- [Cloudinary Video Documentation](https://cloudinary.com/documentation/video_manipulation_and_delivery)
- [Cloudinary Dashboard](https://console.cloudinary.com/)
- [Video Optimization Guide](https://cloudinary.com/documentation/video_optimization)
