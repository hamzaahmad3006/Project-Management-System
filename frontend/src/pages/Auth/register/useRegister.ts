import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { signInWithPopup } from "firebase/auth";
import { auth, githubProvider, provider } from "config/firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginwithgoogle } from "store/slices/authSlice";

export const useRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'MEMBER'
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
            console.log("GitHub user:", user);


        } catch (err) {
            console.log(err);
        }
    };
    const handleSinginWithFigma = async (e: React.FormEvent) => {
        alert('Figma Signin')
    };

    return {
        formData,
        handleChange,
        handleSinginWithGoogle,
        handleSigninWithGithub,
        handleSinginWithFigma,
        loading,
        error
    }
}