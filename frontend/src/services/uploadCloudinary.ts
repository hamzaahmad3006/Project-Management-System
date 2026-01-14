import axios, { AxiosError } from 'axios';
import api from '../api/axios';

interface CloudinarySignResponse {
  signature: string;
  timestamp: string;
  api_key: string;
  upload_preset: string;
  cloud_name: string;
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // 1. Get signature from backend
    const { data: signData } = await api.get<CloudinarySignResponse>('/cloudinary/sign');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signData.signature);
    formData.append('timestamp', signData.timestamp);
    formData.append('api_key', signData.api_key);
    formData.append('upload_preset', signData.upload_preset);

    const cloudName = signData.cloud_name;
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await axios.post(cloudinaryUrl, formData);
    return response.data.secure_url;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ error?: { message: string } }>;
    if (axiosError.response?.data?.error?.message) {
      console.error('Cloudinary Error:', axiosError.response.data.error.message);
      throw new Error(axiosError.response.data.error.message);
    }
    console.error('Upload failed:', error);
    throw error;
  }
};
