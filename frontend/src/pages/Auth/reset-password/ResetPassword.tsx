import React from 'react';
import { useResetPasswordHook } from './useResetPassword';
import InputForm from 'components/ui/inputFields/InputForm';
import ButtonForm from 'components/ui/buttons/ButtonForm';
import { ButtonLoader } from 'components/loader/Loader';

const ResetPassword: React.FC = () => {
    const {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        handleSubmit,
        navigate
    } = useResetPasswordHook();

    return (
        <div className="min-h-screen w-full flex items-center justify-center flex-col bg-gray-50 dark:bg-[#12141c] p-4 font-inter transition-colors duration-300">
            {/* Logo */}
            <div className="mb-10">
                <img src="/assets/logo.png" alt="DEFCON Logo" className="w-[173px] h-[42px] object-contain" />
            </div>

            {/* Content Card */}
            <div className="w-full max-w-md bg-white dark:bg-[#1a1c23] shadow-md dark:shadow-none p-10 dark:border dark:border-gray-800 rounded-xl">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Reset Password</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                    Enter your new password below to reset your account access.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputForm
                        label="New Password"
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 outline-none transition-all"
                        labelClassName="text-sm font-medium text-gray-700 dark:text-gray-300"
                    />

                    <InputForm
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 outline-none transition-all"
                        labelClassName="text-sm font-medium text-gray-700 dark:text-gray-300"
                    />

                    <ButtonForm
                        label={loading ? <ButtonLoader /> : "Reset Password"}
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-[#6696F5] dark:bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center"
                    />
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                    <button
                        onClick={() => navigate('/auth/login')}
                        className="text-sm text-[#F57D2C] font-semibold hover:underline"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
