import { Switch } from '@mui/material';
import React, { useState } from 'react';
import { FaUser, FaTimes } from 'react-icons/fa';
import { CreateModalProps, ProfileSettingsProps } from '../../types';
import { handleChange, handleImageChange, handleChangeProfile } from '../../utils/Hooks/ModalHooks';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/store';
import Loader from 'components/Loaders/Loader';
import { setTheme, ThemeType } from 'store/slices/themeSlice';
import { toast } from 'react-toastify';


const SettingsModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
    const { user } = useSelector((state: RootState) => state.auth)
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState({
        name: user?.name || "",
        role: user?.role || "",
        email: user?.email || "",
        avatar: user?.avatar || "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    if (!isOpen) return null;

    const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            const objectUrl = URL.createObjectURL(selected);
            setPreview(objectUrl);
        }
    };

    const tabs = [
        { id: 'profile', label: 'My Profile', },
        { id: 'security', label: 'Security', },
        { id: 'notifications', label: 'Notifications', },
        { id: 'general', label: 'General', },
        // { id: 'team', label: 'Team', icon: FaUsers },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1a1c23] rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden animate-in fade-in zoom-in duration-200 border dark:border-gray-800">

                {/* Sidebar (Tabs) */}
                <div className="w-48 bg-gray-50 dark:bg-[#15171e] border-r border-gray-200 dark:border-gray-800 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-sm font-medium text-[#8F929C]">Settings</h2>
                    </div>
                    <nav className="flex-1 p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                    ${activeTab === tab.id
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                        : 'text-[#25272D] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >

                                {tab.label}
                            </button>
                        ))}

                        <div className="p-4 ">
                            <h2 className="text-sm font-medium text-[#8F929C]">Workspace</h2>
                        </div>

                        <div className="pl-4 flex justify-between items-start flex-col gap-2">
                            <h2 className="pb-4 text-sm font-medium text-[#25272D] dark:text-gray-300">Settings</h2>
                            <h2 className="pb-4 text-sm font-medium text-[#25272D] dark:text-gray-300">Teamspace</h2>
                            <h2 className="pb-4 text-sm font-medium text-[#25272D] dark:text-gray-300">Members</h2>
                            <h2 className="pb-4 text-sm font-medium text-[#25272D] dark:text-gray-300">Integration</h2>
                        </div>
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-sm font-semibold text-[#25272D] dark:text-gray-100 capitalize">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h3>
                        <button
                            onClick={() => {
                                if (preview) URL.revokeObjectURL(preview);
                                onClose();
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-[#1a1c23]">
                        {activeTab === 'profile' && (
                            <ProfileSettings
                                profile={profile}
                                setProfile={setProfile}
                                file={file}
                                setFile={setFile}
                                preview={preview}
                                setPreview={setPreview}
                                onImageSelect={onImageSelect}
                                loading={loading}
                                setLoading={setLoading}
                            />
                        )}

                        {activeTab === 'security' && <SecuritySettings />}
                        {activeTab === 'notifications' && <NotificationsSettings />}
                        {activeTab === 'general' && <GeneralSettings />}

                    </div>
                </div>


            </div >
        </div >
    );
};




const ProfileSettings: React.FC<ProfileSettingsProps & {
    file: File | null,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    preview: string | null,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}> = ({
    profile, setProfile, file, setFile, preview, setPreview, onImageSelect, loading, setLoading
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
                            onClick={() => {
                                if (preview) URL.revokeObjectURL(preview);
                                setPreview(null);
                                setProfile((prev) => ({ ...prev, avatar: "" }));
                                setFile(null);
                            }}
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
                            onChange={(e) => handleChange(e, setProfile)}
                            className="w-full px-3 py-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Job title</label>
                        <input
                            type="text"
                            name="role"
                            value={profile.role}
                            onChange={(e) => handleChange(e, setProfile)}
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
                            onChange={(e) => handleChange(e, setProfile)}
                            className="w-full px-3 py-2 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t dark:border-gray-800 pt-4 flex items-center gap-3">
                    {loading ? (
                        <Loader />
                    ) : (
                        <button
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                            onClick={async () => {
                                await handleChangeProfile(profile, file, setProfile, setLoading);
                                if (preview) URL.revokeObjectURL(preview);
                                setPreview(null);
                                setFile(null);
                            }}
                        >
                            Save
                        </button>
                    )}
                    <button
                        className="px-5 py-2.5 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                            if (preview) URL.revokeObjectURL(preview);
                            setPreview(null);
                            setFile(null);
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };


const SecuritySettings = () => (
    <div className="space-y-6 max-w-lg animate-in fade-in duration-300">
        <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-6 uppercase tracking-wider">Change Password</h4>
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                </div>
            </div>
        </div>
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all transform active:scale-95">
                Update Password
            </button>
        </div>
    </div>
);

const GeneralSettings = () => {
    const dispatch = useDispatch();
    const currentTheme = useSelector((state: RootState) => state.theme.theme);
    const [localTheme, setLocalTheme] = useState<ThemeType>(currentTheme);

    const handleSave = () => {
        dispatch(setTheme(localTheme));
        toast.success(`Theme updated to ${localTheme}`);
    };

    return (
        <div className="w-full max-w-xl bg-white dark:bg-[#1a1c23] rounded-lg p-2 ">
            {/* FORM FIELDS */}
            <div className="space-y-3">

                {/* THEME */}
                <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Theme</label>
                    <select
                        value={localTheme}
                        onChange={(e) => setLocalTheme(e.target.value as ThemeType)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                    </select>
                </div>

                {/* LANGUAGE */}
                <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Language</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>English</option>
                        <option>Urdu</option>
                        <option>Arabic</option>
                    </select>
                </div>

                {/* TIME ZONE */}
                <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Time zone</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>Islamabad</option>
                        <option>Karachi</option>
                        <option>Lahore</option>
                        <option>Dubai</option>
                    </select>
                </div>

                {/* TIME FORMAT */}
                <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Time format</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>13:00</option>
                        <option>01:00 PM</option>
                    </select>
                </div>

                {/* DATE FORMAT */}
                <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Date Format</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>DD-MM-YYYY</option>
                        <option>MM-DD-YYYY</option>
                        <option>YYYY-MM-DD</option>
                    </select>
                </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="border-t dark:border-gray-800 pt-4 flex items-center gap-3">

                <button
                    onClick={handleSave}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                    Save
                </button>

                <button
                    onClick={() => setLocalTheme(currentTheme)}
                    className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Cancel
                </button>

            </div>
        </div>
    );
};



const NotificationsSettings = () => {
    return (
        <div className="w-full max-w-2xl bg-white dark:bg-[#1a1c23] rounded-lg space-y-8 animate-in fade-in duration-300">
            {/* TITLE */}
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Notifications</h2>

            {/* SECTION 1: Activity */}
            <div className="space-y-6">
                {/* Activity Updates */}
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">Activity updates</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                            New tasks assigned to you, @mentions, and completion notifications for tasks you're a collaborator on
                        </p>
                    </div>
                    <Switch
                        checked={true}
                        onChange={() => { }}
                        color="primary"
                    />
                </div>

                {/* Mentions */}
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">Mentions</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                            New tasks assigned to you, direct messages, and @mentions
                        </p>
                    </div>
                    <Switch
                        checked={true}
                        onChange={() => { }}
                        color="primary"
                    />
                </div>

                {/* Divider */}
                <hr className="border-gray-100 dark:border-gray-800" />
            </div>

            {/* SECTION 2: Email */}
            <div className="space-y-6">
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Emails</p>

                {/* Daily Digest */}
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">Daily digest</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                            Personalized productivity stats plus your tasks due today.
                        </p>
                    </div>
                    <Switch
                        checked={true}
                        onChange={() => { }}
                        color="primary"
                    />
                </div>

                {/* Tips and Tricks */}
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">Tips and tricks</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                            Powerful productivity advice in your inbox, Sent once a month.
                        </p>
                    </div>
                    <Switch
                        checked={true}
                        onChange={() => { }}
                        color="primary"
                    />
                </div>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex items-center gap-3">
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all transform active:scale-95">
                    Save Changes
                </button>
                <button className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                    Cancel
                </button>
            </div>
        </div >
    );
};


export default SettingsModal;


