import React from 'react';
import { Switch } from '@mui/material';

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

export default NotificationsSettings;
