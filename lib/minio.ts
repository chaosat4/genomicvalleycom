import { Client } from 'minio';

if (!process.env.MINIO_ENDPOINT || !process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
  throw new Error('Missing required MinIO environment variables');
}

// Remove protocol from endpoint if present
const cleanEndpoint = process.env.MINIO_ENDPOINT.replace(/^https?:\/\//, '');

const minioClient = new Client({
  endPoint: 's3.genomicvalley.in',
  port: 443, // Use 443 for HTTPS
  useSSL: true, // Enable SSL since we're using HTTPS
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export const BUCKET_NAME = 'quotations';

// Initialize bucket if it doesn't exist
async function initializeBucket() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME);
    console.log(`Bucket '${BUCKET_NAME}' created successfully`);
  }
}

initializeBucket().catch(console.error);

export { minioClient };

export const uploadPDFToMinIO = async (filename: string, pdfBuffer: Buffer) => {
  try {
    const uploadResult = await minioClient.putObject(BUCKET_NAME, filename, pdfBuffer);
    return uploadResult;
  } catch (error) {
    console.error('Error uploading PDF to MinIO:', error);
    throw error;
  }
};

export const getPresignedUrl = async (filename: string, expirySeconds: number = 604800) => {
  try {
    const presignedUrl = await minioClient.presignedGetObject(BUCKET_NAME, filename, expirySeconds);
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};

export const getPermanentLink = (filename: string) => {
  return {
    bucket: BUCKET_NAME,
    objectKey: filename,
    fullPath: `${BUCKET_NAME}/${filename}`
  };
};
