import React from 'react';
import { FaUser, FaTimes } from 'react-icons/fa';
import { ButtonLoader } from '../../loader/Loader';
import { ProfileSettingsProps } from 'types';
import InputForm from 'components/ui/inputFields/InputForm';
import FileInputForm from 'components/ui/inputFields/FileInputForm';




const ProfileSettings: React.FC<ProfileSettingsProps> = ({
    profile, onImageSelect, onRemoveImage, handleChange, handleSave, onCancel, onDeleteAccount, preview, loading
}) => {
    return (
        <div className="w-full max-w-2xl bg-white dark:bg-[#1a1c23] rounded-xl shadow-sm overflow-hidden">

            <div className=" space-y-4">
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Photo</label>
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 border flex items-center justify-center overflow-hidden">
                            {(preview || profile.avatar) ? (
                                <img src={preview || profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FaUser size={28} className="text-gray-300" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <FileInputForm
                                    label="Upload new photo"
                                    accept="image/*"
                                    onChange={onImageSelect}
                                    labelClassName="!text-blue-600 hover:underline cursor-pointer !font-medium !p-0 !bg-transparent dark:!bg-transparent !border-none !text-sm"
                                />

                                <span className="text-gray-300">.</span>

                                <button
                                    onClick={onRemoveImage}
                                    className="text-blue-600 hover:underline font-normal"
                                >
                                    Remove photo
                                </button>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Pick a photo up to 4MB.</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    <InputForm
                        label="Full name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full"
                        labelClassName='text-sm font-medium !text-gray-500'
                    />

                    <InputForm
                        label="Job title"
                        name="role"
                        value={profile.role}
                        onChange={handleChange}
                        className="w-full"
                        labelClassName='text-sm font-medium !text-gray-500'
                    />

                    <div className="space-y-1">
                        <label className="text-sm font-medium !text-gray-500">Team</label>
                        <div className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                            {profile.team}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <button className="text-gray-400 hover:text-gray-600 text-sm font-medium">Change email</button>
                        </div>
                        <InputForm
                            name="email"
                            disabled={true}
                            value={profile.email}
                            onChange={handleChange}
                            className="w-full bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-[#15171c] flex justify-between items-center">
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-[#0084ff] text-white px-8 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                        {loading ? <ButtonLoader /> : 'Save'}
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-white border px-8 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                <button
                    onClick={onDeleteAccount}
                    disabled={loading}
                    className="text-red-500 border border-red-200 px-6 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                    Delete account
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;
