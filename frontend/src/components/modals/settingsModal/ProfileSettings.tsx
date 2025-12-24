import React from 'react';
import { FaUser } from 'react-icons/fa';
import { ButtonLoader, Loader } from '../../loader/Loader';
import { UserProfile } from '../../../types';

interface ProfileSettingsProps {
    profile: UserProfile;
    onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSave: () => Promise<void>;
    onCancel: () => void;
    preview: string | null;
    loading: boolean;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
    profile, onImageSelect, handleChange, handleSave, onCancel, preview, loading
}) => {
    return (
        <div className="w-full max-w-xl bg-white dark:bg-[#1a1c23] rounded-lg space-y-6">

            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 border dark:border-gray-700 flex items-center justify-center overflow-hidden">
                    {(preview || profile.avatar) ? (
                        <img src={preview || profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <FaUser size={32} className="text-gray-400 dark:text-gray-500" />
                    )}
                </div>

                <div className="flex gap-3">
                    <label className="px-3 py-2 cursor-pointer border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                        Upload
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onImageSelect}
                            className="hidden"
                        />
                    </label>

                    <button
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={onCancel} // In the original it was just resetting local preview
                    >
                        Remove photo
                    </button>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Full name</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Job title</label>
                    <input
                        type="text"
                        name="role"
                        value={profile.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Email</label>
                    <input
                        type="email"
                        name="email"
                        disabled
                        value={profile.email}
                        className="w-full px-3 py-2 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t dark:border-gray-800 pt-4 flex items-center gap-3">

                <button
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    onClick={handleSave}
                >
                    {loading ? <ButtonLoader /> : 'Save'}
                </button>

                <button
                    className="px-5 py-2.5 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;
