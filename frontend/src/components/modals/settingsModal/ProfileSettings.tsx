import React from 'react';
import { FaUser } from 'react-icons/fa';
import { ButtonLoader, Loader } from '../../loader/Loader';
import { UserProfile } from '../../../types';
import InputForm from 'components/ui/inputFields/InputForm';
import FileInputForm from 'components/ui/inputFields/FileInputForm';
import ButtonForm from 'components/ui/buttons/ButtonForm';

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
                    <FileInputForm
                        label="Upload"
                        accept="image/*"
                        onChange={onImageSelect}
                        labelClassName="px-3 py-1.5 text-sm"
                        className="rounded-md"
                        disabled={loading}
                    />

                    <ButtonForm
                        label="Remove photo"
                        onClick={onCancel}
                        disabled={loading}
                        variant="secondary"
                        size="sm"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <InputForm
                        label="Full name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="px-3 py-2 "
                    />
                </div>
                <div>
                    <InputForm
                        label="Job title"
                        name="role"
                        value={profile.role}
                        onChange={handleChange}
                        className="px-3 py-2 "
                    />
                </div>
                <div>
                    <InputForm
                        label="Email"
                        name="email"
                        disabled={true}
                        onChange={handleChange}
                        value={profile.email}
                        className="px-3 py-2 cursor-not-allowed"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t dark:border-gray-800 pt-4 flex items-center gap-3">

                <ButtonForm
                    label={loading ? <ButtonLoader /> : 'Save'}
                    onClick={handleSave}
                    disabled={loading}
                    variant="primary"
                    size="md"
                />

                <ButtonForm
                    label="Cancel"
                    onClick={onCancel}
                    disabled={loading}
                    variant="secondary"
                    size="md"
                />
            </div>
        </div>
    );
};

export default ProfileSettings;
