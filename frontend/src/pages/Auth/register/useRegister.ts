import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { signInWithPopup } from "firebase/auth";
import { auth, githubProvider, provider } from "config/firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginwithgithub, loginwithgoogle, register } from "store/slices/authSlice";
import { toast } from 'react-toastify';

export const useRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'MEMBER' as 'MEMBER' | 'MANAGER'
    });
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSinginWithGoogle = async (e: React.FormEvent) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const payload = await dispatch(loginwithgoogle({
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL
            })).unwrap();

            // Navigate only if login success
            navigate('/');
        } catch (err) {
            console.error("Google sign in error:", err);
        }
    };
    const handleSigninWithGithub = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await signInWithPopup(auth, githubProvider);
            const user = result.user;
            const email =
                user.email ||
                user.providerData?.find(p => p.email)?.email ||
                null;

            console.log("GitHub user:", user);
            const payload = await dispatch(loginwithgithub({
                email,
                name: user.displayName,
                photoURL: user.photoURL
            })).unwrap();

            console.log("PyayLoad", payload);


            // Navigate only if login success
            navigate('/');


        } catch (err) {
            console.log(err);
        }
    };
    const handleSinginWithFigma = async (e: React.FormEvent) => {
        alert('Figma Signin')
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await dispatch(register({
                email: formData.email,
                name: formData.name || formData.email.split('@')[0],
                role: formData.role
            })).unwrap();

            window.toastify("Account created successfully! Check your email for password.");
            navigate('/auth/login');
        } catch (err: any) {
            toast.error(err || "Registration failed");
            console.error("Registration error:", err);
        }
    };

    return {
        formData,
        handleChange,
        handleSinginWithGoogle,
        handleSigninWithGithub,
        handleSinginWithFigma,
        handleSubmit,
        loading,
        error
    }
}