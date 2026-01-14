import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import api from '../../../api/axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { deleteAccount } from '../../../store/slices/authSlice';
import { UserProfile, User } from 'types';
import { uploadToCloudinary } from '../../../services/uploadCloudinary';

export const useSettings = (user: User | null, onClose: () => void) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || '',
    role: user?.role || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    team: user?.teamMemberships?.[0]?.team?.name || 'No team Yet',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const objectUrl = URL.createObjectURL(selected);
      setPreview(objectUrl);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev: UserProfile) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      let avatarUrl = profile.avatar;

      if (file) {
        avatarUrl = await uploadToCloudinary(file);
      }

      const saveRes = await api.put('/auth/profile', { name: profile.name, avatar: avatarUrl });

      const result = saveRes.data;

      setProfile((prev: UserProfile) => ({ ...prev, avatar: result.avatar || avatarUrl }));
      window.toastify('Profile updated!', 'success');

      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setFile(null);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      window.toastify(error.response?.data?.message || 'Profile update failed!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setProfile((prev: UserProfile) => ({ ...prev, avatar: '' }));
  };

  const handleClose = () => {
    if (preview) URL.revokeObjectURL(preview);
    onClose();
  };

  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action is permanent and will delete all your projects and data.'
    );

    if (confirmDelete) {
      try {
        setLoading(true);
        await dispatch(deleteAccount()).unwrap();
        window.toastify('Account deleted successfully', 'success');
        onClose(); // This might be redundant if the app redirects on logOut
      } catch (err: unknown) {
        const errorMessage = typeof err === 'string' ? err : 'Account deletion failed';
        window.toastify(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    activeTab,
    setActiveTab,
    profile,
    setProfile,
    file,
    setFile,
    preview,
    setPreview,
    loading,
    setLoading,
    onImageSelect,
    onRemoveImage,
    handleChange,
    handleSaveProfile,
    handleClose,
    handleDeleteAccount,
  };
};
