import React, { useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { changePassword } from 'store/slices/authSlice';
import ButtonForm from 'components/ui/buttons/ButtonForm';
import InputForm from 'components/ui/inputFields/InputForm';
import { toast } from 'react-toastify';
import { ButtonLoader } from 'components/loader/Loader';
import { AxiosError } from 'axios';

const SecuritySettings = () => {
    const dispatch = useAppDispatch();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdatePassword = async () => {
        if (!passwords.currentPassword || !passwords.newPassword) {
            toast.error('All fields are required');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await dispatch(changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            })).unwrap();

            toast.success('Password updated successfully');
            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            const errorMessage = error.response?.data?.message || "Failed to update password";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-lg animate-in fade-in duration-300">
            <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-6 uppercase tracking-wider">Change Password</h4>
                <div className="space-y-5">
                    <div>
                        <InputForm
                            label="Current Password"
                            name="currentPassword"
                            placeholder="Enter current password"
                            type="password"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                            className="px-3 py-2"
                        />
                    </div>
                    <div>
                        <InputForm
                            label="New Password"
                            name="newPassword"
                            placeholder="Enter new password"
                            type="password"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            className="px-3 py-2"
                        />
                    </div>
                    <div>
                        <InputForm
                            label="Confirm New Password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            className="px-3 py-2"
                        />
                    </div>
                </div>
            </div>
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <ButtonForm
                    label={loading ? <ButtonLoader /> : "Update Password"}
                    onClick={handleUpdatePassword}
                    disabled={loading}
                    variant="primary"
                    size="md"
                />
            </div>
        </div>
    );
};

export default SecuritySettings;
