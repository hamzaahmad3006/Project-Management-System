import axios from "axios";
import { UserProfile } from "../types";
import api from "api/axios";


export const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<UserProfile>>
) => {
    const { name, value } = e.target;
    setState((prev: UserProfile) => ({
        ...prev,
        [name]: value,
    }));
};

// settingModal Profile Picture 
export const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
};


// settingModal Profile Update Function 

export const handleChangeProfile = async (
    profile: UserProfile,
    file: File | null,
    setProfile: React.Dispatch<React.SetStateAction<UserProfile>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        setLoading(true);
        let avatarUrl = profile.avatar;

        // Upload file to Cloudinary if exists
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "ml_default"); // User confirmed default or didn't change

            const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY_URL;

            if (!cloudinaryUrl) {
                throw new Error("REACT_APP_CLOUDINARY_URL is not defined");
            }

            const res = await axios.post(cloudinaryUrl, formData);

            avatarUrl = res.data.secure_url;
        }


        const saveRes = await api.put("/auth/profile",
            { name: profile.name, avatar: avatarUrl },)

        const result = saveRes.data;

        setProfile((prev) => ({ ...prev, avatar: result.avatar || avatarUrl }));
        window.toastify("Profile updated!", "success");

    } catch (err) {
        console.error(err);
        window.toastify("Profile update failed!", "error");
    } finally {
        setLoading(false);
    }
};
