import axios from 'axios';
import api from '../api/axios';

export const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
        // 1. Get signature from backend
        const { data: signData } = await api.get('/cloudinary/sign');

        const formData = new FormData();
        formData.append("file", file);
        formData.append("signature", signData.signature);
        formData.append("timestamp", signData.timestamp);
        formData.append("api_key", signData.api_key);
        formData.append("upload_preset", signData.upload_preset);

        const cloudName = signData.cloud_name;
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const response = await axios.post(cloudinaryUrl, formData);
        return response.data.secure_url;
    } catch (error: any) {
        if (error.response?.data?.error?.message) {
            console.error("Cloudinary Error:", error.response.data.error.message);
            throw new Error(error.response.data.error.message);
        }
        console.error("Upload failed:", error);
        throw error;
    }
};
