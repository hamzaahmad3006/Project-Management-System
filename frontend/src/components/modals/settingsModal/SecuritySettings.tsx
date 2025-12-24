import React from 'react';

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

export default SecuritySettings;
