import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store/hooks';
import { resetPassword } from 'store/slices/authSlice';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export const useResetPasswordHook = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid or missing reset token");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await dispatch(resetPassword({ token, newPassword })).unwrap();
            toast.success("Password reset successfully! Please log in with your new password.");
            navigate('/auth/login');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        handleSubmit,
        navigate
    };
};
