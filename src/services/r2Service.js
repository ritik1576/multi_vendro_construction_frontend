import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize the S3 Client for Cloudflare R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: import.meta.env.VITE_R2_ENDPOINT, // e.g., 'https://<ACCOUNT_ID>.r2.cloudflarestorage.com'
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Uploads an image file to Cloudflare R2 and returns its public URL.
 * 
 * @param {File} file - The file object from the file input.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
export const uploadImageToR2 = async (file) => {
  if (!file) throw new Error("No file provided");

  const bucketName = import.meta.env.VITE_R2_BUCKET_NAME;
  const publicUrlPrefix = import.meta.env.VITE_R2_PUBLIC_URL_PREFIX; // e.g., 'https://pub-xxxx.r2.dev'

  if (!bucketName || !publicUrlPrefix) {
    throw new Error("R2 configuration is incomplete. Check your .env file settings.");
  }

  // Generate a unique filename to prevent collisions
  const extension = file.name.split('.').pop();
  const uniqueFilename = `products/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
  
  // Convert File to Uint8Array for browser compatibility with AWS SDK
  const fileBuffer = await file.arrayBuffer();
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueFilename,
    Body: new Uint8Array(fileBuffer),
    ContentType: file.type,
    // Optional: add CacheControl or ACLs depending on R2 bucket settings
  });

  try {
    await r2Client.send(command);
    // Combine the public custom domain/prefix with the generated key
    return `${publicUrlPrefix.replace(/\/$/, '')}/${uniqueFilename}`;
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw new Error("Failed to upload image to Cloudflare R2. Please try again.");
  }
};
