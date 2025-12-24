import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { setTheme, ThemeType } from '../../../store/slices/themeSlice';
import { toast } from 'react-toastify';

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

export default GeneralSettings;
