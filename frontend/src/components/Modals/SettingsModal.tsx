import { Switch } from '@mui/material';
import React, { useState } from 'react';
import { FaUser, FaLock, FaBell, FaUsers, FaTimes } from 'react-icons/fa';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('profile');

    if (!isOpen) return null;

    const tabs = [
        { id: 'profile', label: 'My Profile', },
        { id: 'security', label: 'Security', },
        { id: 'notifications', label: 'Notifications', },
        { id: 'general', label: 'General', },
        // { id: 'team', label: 'Team', icon: FaUsers },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Sidebar (Tabs) */}
                <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-sm font-medium text-[#8F929C]">Settings</h2>
                    </div>
                    <nav className="flex-1 p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                    ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-[#25272D] hover:bg-gray-100'
                                    }`}
                            >

                                {tab.label}
                            </button>
                        ))}

                        <div className="p-4 ">
                            <h2 className="text-sm font-medium text-[#8F929C]">Workspace</h2>
                        </div>

                        <div className="pl-4 flex justify-between items-start flex-col gap-2">
                            <h2 className="pb-4 text-sm font-medium text-[#25272D]">Settings</h2>
                            <h2 className="pb-4 text-sm font-medium text-[#25272D]">Teamspace</h2>
                            <h2 className="pb-4 text-sm font-medium text-[#25272D]">Members</h2>
                            <h2 className="pb-4 text-sm font-medium text-[#25272D]">Integration</h2>
                        </div>
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between p-2 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-[#25272D] capitalize">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {activeTab === 'profile' && <ProfileSettings />}
                        {activeTab === 'security' && <SecuritySettings />}
                        {activeTab === 'notifications' && <NotificationsSettings />}
                        {activeTab === 'general' && <GeneralSettings />}

                    </div>
                </div>


            </div >
        </div >
    );
};

// --- Sub-components (can be moved to separate files later) ---



const ProfileSettings = () => {
    return (
        <div className="w-full max-w-xl bg-white rounded-lg  space-y-6">

            {/* PHOTO */}
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
                    <FaUser size={32} className="text-gray-400" />
                </div>

                <div className="flex gap-3">
                    <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">
                        Upload new photo
                    </button>

                    <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">
                        Remove photo
                    </button>

                </div>
            </div>

            {/* FORM */}
            <div className="space-y-4">
                {/* FULL NAME */}
                <div>
                    <label className="text-sm text-gray-500 mb-1 block">Full name</label>
                    <input
                        type="text"
                        defaultValue="Yauhen Rymaszewski"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>

                {/* JOB TITLE */}
                <div>
                    <label className="text-sm text-gray-500 mb-1 block">Job title</label>
                    <input
                        type="text"
                        defaultValue="Product designer"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>

                {/* TEAM DROPDOWN (same as UI) */}
                <div>
                    <label className="text-sm text-gray-500 mb-1 block">Team</label>
                    <select className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>Designer Team</option>
                        <option>Developer Team</option>
                        <option>Marketing Team</option>
                    </select>
                </div>

                {/* EMAIL */}
                <div>
                    <label className="text-sm text-gray-500 mb-1 block">Email</label>
                    <input
                        type="email"
                        defaultValue="yauhen1312@gmail.com"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="border-t pt-4 flex items-center gap-3">
                <button className="px-5 py-2.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
                    Save
                </button>

                <button className="px-5 py-2.5 rounded-md bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-100">
                    Cancel
                </button>

                <button className="ml-auto px-5 py-2.5 rounded-md border border-red-600 text-red-600 text-sm hover:bg-red-50">
                    Delete account
                </button>
            </div>
        </div>
    );
};



// const ProfileSettings = () => (
//     <div className="space-y-6 max-w-lg ">
//         <div className="flex items-center gap-6 ">
//             <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-400 font-bold border-4 border-white shadow-sm">
//                 <FaUser size={20} />
//             </div>
//             <div className='flex gap-2 w-[250px]'>
//                 <button className="bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
//                     Upload new Photo
//                 </button>

//                 <button className="bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
//                     Remove Photo
//                 </button>
//             </div>

//             {/* <p className="mt-1 text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p> */}

//         </div>

//         <div className="space-y-4">
//             <div>
//                 <label className="block text-sm font-medium text-[#8F929C] mb-1">Full Name</label>
//                 <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
//             </div>
//             <div>
//                 <label className="block text-sm font-medium text-[#8F929C] mb-1">Job title</label>
//                 <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
//             </div>
//             <div>
//                 <label className="block text-sm font-medium text-[#8F929C] mb-1">Team</label>
//                 <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
//             </div>
//             <div>
//                 <label className="block text-sm font-medium text-[#8F929C] mb-1">Email Address</label>
//                 <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
//             </div>

//         </div>


//         <div className="flex flex-row border-t border-gray-500 pt-4 space-x-2">

//             <button className="px-5 py-2.5 rounded-lg bg-blue-600 text-white  text-sm font-medium hover:bg-blue-700 shadow-sm">Save</button>
//             <button className="px-5 py-2.5 rounded-lg bg-white text-gray-600  text-sm font-medium hover:bg-gray-100 shadow-sm">Cancel</button>
//             <button className="px-5 py-2.5 rounded-lg border-solid border border-red-600 text-red-600  text-sm font-medium  shadow-sm">Delete Account</button>

//         </div>




//     </div>
// );





const SecuritySettings = () => (
    <div className="space-y-6 max-w-lg">
        <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Change Password</h4>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
            </div>
        </div>
        <div className="pt-4">
            <button className="px-5 py-2.5  bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">Update Password</button>
        </div>
    </div>
);

const GeneralSettings = () => {
    return (
        <div className="w-full max-w-xl bg-white rounded-lg p-2 ">
            {/* FORM FIELDS */}
            <div className="space-y-3">

                {/* THEME */}
                <div>
                    <label className="text-sm text-gray-500 mb-1 block">Theme</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>System</option>
                    </select>
                </div>

                {/* LANGUAGE */}
                <div>
                    <label className="text-sm text-gray-500 mb-1 block">Language</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>English</option>
                        <option>Urdu</option>
                        <option>Arabic</option>
                    </select>
                </div>

                {/* TIME ZONE */}
                <div>
                    <label className="text-sm text-gray-500 mb-1 block">Time zone</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>Islamabad</option>
                        <option>Karachi</option>
                        <option>Lahore</option>
                        <option>Dubai</option>
                    </select>
                </div>

                {/* TIME FORMAT */}
                <div>
                    <label className="text-sm text-gray-500 mb-1 block">Time format</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>13:00</option>
                        <option>01:00 PM</option>
                    </select>
                </div>

                {/* DATE FORMAT */}
                <div>
                    <label className="text-sm text-gray-500 mb-1 block">Date Format</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>DD-MM-YYYY</option>
                        <option>MM-DD-YYYY</option>
                        <option>YYYY-MM-DD</option>
                    </select>
                </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="border-t pt-4 flex items-center gap-3">

                <button className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                    Save
                </button>

                <button className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                    Cancel
                </button>

            </div>
        </div>
    );
};



const NotificationsSettings = () => {
    return (
        <div className="w-full max-w-2xl bg-white  rounded-lg space-y-6 font-inter">

            {/* TITLE */}
            <h2 className="text-lg font-semibold">Notifications</h2>

            {/* SECTION 1: Activity */}
            <div className="space-y-6">

                {/* Activity Updates */}
                <div className="flex items-start justify-between w-[590px]">
                    <div>
                        <p className="font-medium text-gray-800">Activity updates</p>
                        <p className="text-sm text-[#74798B] mt-1 ">
                            New tasks assigned to you, @mentions, and completion notifications for tasks you're a collaborator on
                        </p>
                    </div>

                    <div className="flex items-end justify-end ">

                        <Switch
                            checked={true}
                            onChange={() => { }}
                            color="primary"   // blue toggle
                        />

                    </div>

                </div>

                {/* Mentions */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-medium text-gray-800">Mentions</p>
                        <p className="text-sm text-gray-500 mt-1">
                            New tasks assigned to you, direct messages, and @mentions
                        </p>
                    </div>

                    <Switch
                        checked={true}
                        onChange={() => { }}
                        color="primary"   // blue toggle
                    />
                    <span
                        className={`${true ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 rounded-full bg-white transition`}
                    />

                </div>

                {/* Divider */}
                <hr className="border-gray-200 mt-2" />
            </div>

            {/* SECTION 2: Email */}
            <div className="space-y-6">

                <p className="font-medium text-gray-800">Emails</p>

                {/* Daily Digest */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-medium text-gray-800">Daily digest</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Personalized productivity stats plus your tasks due today.
                        </p>
                    </div>

                    <Switch
                        checked={true}
                        onChange={() => { }}
                        color="primary"   // blue toggle
                    />

                </div>

                {/* Tips and Tricks */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-medium text-gray-800">Tips and tricks</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Powerful productivity advice in your inbox, Sent once a month.
                        </p>
                    </div>

                    <Switch
                        checked={true}
                        onChange={() => { }}
                        color="primary"   // blue toggle
                    />
                </div>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="border-t pt-4 flex items-center gap-3">
                <button className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                    Save
                </button>

                <button className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                    Cancel
                </button>
            </div>
        </div >
    );
};



// const NotificationSettings = () => (
//     <div className="space-y-6">
//         <div className="space-y-4">
//             <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
//             <div className="space-y-3">
//                 {['New tasks assigned to me', 'Comments on my tasks', 'Project status updates', 'Team invites'].map((item, idx) => (
//                     <label key={idx} className="flex items-center gap-3 cursor-pointer">
//                         <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
//                         <span className="text-sm text-gray-700">{item}</span>
//                     </label>
//                 ))}
//             </div>
//         </div>
//     </div>
// );

export default SettingsModal;
