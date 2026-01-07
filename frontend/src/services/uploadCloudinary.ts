import axios from 'axios';

export const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY_URL;

    if (!cloudinaryUrl) {
        throw new Error("Cloudinary URL is missing in environment variables");
    }

    const response = await axios.post(cloudinaryUrl, formData);
    return response.data.secure_url;
};
