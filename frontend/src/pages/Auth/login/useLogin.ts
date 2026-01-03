import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../../config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { login, loginwithgoogle, forgotPassword } from '../../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const useLoginHook = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(login({ email, password }));
        if (login.fulfilled.match(result)) {
            navigate('/');
        }
    };

    const handleSigninWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const payload = await dispatch(loginwithgoogle({
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL
            })).unwrap();


            navigate('/');
            window.toastify("Signin successful", "success");
        } catch (err) {
            console.error("Google sign in error:", err);
        }


    };
    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email address first");
            return;
        }
        setForgotLoading(true);
        try {
            await dispatch(forgotPassword({ email })).unwrap();
            toast.success("Password reset link sent to your email!");
        } catch (err: any) {
            toast.error(err || "Failed to send reset link");
        } finally {
            setForgotLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleSubmit,
        handleSigninWithGoogle,
        handleForgotPassword,
        forgotLoading,
        loading,
        error,
        navigate
    };
}