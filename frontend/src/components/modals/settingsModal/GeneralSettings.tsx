import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { setTheme, ThemeType } from '../../../store/slices/themeSlice';
import { toast } from 'react-toastify';
import SelectField from 'components/ui/inputFields/SelectedForm';
import { FaChevronDown } from 'react-icons/fa';
import ButtonForm from 'components/ui/buttons/ButtonForm';

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

            <div className="space-y-3">
                <div>
                    <SelectField
                        label="Theme"
                        name="theme"
                        icon={<FaChevronDown size={12} />}
                        value={localTheme}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLocalTheme(e.target.value as ThemeType)}
                        options={[
                            { label: "Light", value: "light" },
                            { label: "Dark", value: "dark" },
                        ]}
                        placeholder=""
                        className="px-3 py-2 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        labelClassName="text-sm text-gray-500 dark:text-gray-400 mb-1 block"
                    />

                </div>


                <div>
                    <SelectField
                        label="Language"
                        name="language"
                        value={localTheme}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLocalTheme(e.target.value as ThemeType)}
                        options={[
                            { label: "English", value: "english" },
                            { label: "Urdu", value: "urdu" },
                            { label: "Arabic", value: "arabic" },
                        ]}
                        placeholder=""
                        className="px-3 py-2 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        labelClassName="text-sm text-gray-500 dark:text-gray-400 mb-1 block"
                    />
                </div>

                <div>
                    <SelectField
                        label="Time zone"
                        name="timezone"
                        value={localTheme}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLocalTheme(e.target.value as ThemeType)}
                        options={[
                            { label: "Islamabad", value: "islamabad" },
                            { label: "Karachi", value: "karachi" },
                            { label: "Lahore", value: "lahore" },
                            { label: "Dubai", value: "dubai" },
                        ]}
                        placeholder=""
                        className="px-3 py-2 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        labelClassName="text-sm text-gray-500 dark:text-gray-400 mb-1 block"
                    />
                </div>

                <div>
                    <SelectField
                        label="Time format"
                        name="timeformat"
                        value={localTheme}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLocalTheme(e.target.value as ThemeType)}
                        options={[
                            { label: "13:00", value: "13:00" },
                            { label: "01:00 PM", value: "01:00 PM" },
                        ]}
                        placeholder=""
                        className="px-3 py-2 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        labelClassName="text-sm text-gray-500 dark:text-gray-400 mb-1 block"
                    />
                </div>

                <div>
                    <SelectField
                        label="Date format"
                        name="dateformat"
                        value={localTheme}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLocalTheme(e.target.value as ThemeType)}
                        options={[
                            { label: "DD-MM-YYYY", value: "dd-mm-yyyy" },
                            { label: "MM-DD-YYYY", value: "mm-dd-yyyy" },
                            { label: "YYYY-MM-DD", value: "yyyy-mm-dd" },
                        ]}
                        placeholder=""
                        className="px-3 py-2 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        labelClassName="text-sm text-gray-500 dark:text-gray-400 mb-1 block"
                    />
                </div>

            </div>


            <div className="border-t dark:border-gray-800 pt-4 flex items-center gap-3">

                <ButtonForm
                    label="Save"
                    onClick={handleSave}
                    variant='primary'
                    size='md'
                    className="px-5 py-2.5 "
                />


                <ButtonForm
                    label="Cancel"
                    onClick={() => setLocalTheme(currentTheme)}
                    variant='secondary'
                    size='md'
                    className="px-5 py-2.5 "
                />

            </div>
        </div>
    );
};

export default GeneralSettings;
