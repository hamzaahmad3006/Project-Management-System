import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginwithgoogle, register } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, githubProvider, provider } from '../../config/firebase';


const Register: React.FC = () => {
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

    return (
        <div className="register-container ">
            {/* Logo - Top */}
            <div className="register-logo-main-div">
                <div className="register-logo-div">
                    <img src="/assets/logo.png" alt="DEFCON Logo" className="register-logo-img" />
                </div>
            </div>

            {/* Main Content - Center */}
            <div className="register-card">
                {/* Title */}
                <h2 className="register-title text-center text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 uppercase tracking-tight">Sign up</h2>

                {/* Google Button */}
                <button className="register-signin-btn" onClick={handleSinginWithGoogle}>
                    <img src="/assets/google.png" className="w-4 h-4" alt="Google" />
                    Continue with Google
                </button>

                {/* GitHub Button */}
                <button className="register-signin-btn mt-5" onClick={handleSigninWithGithub}>
                    <img src="/assets/github.png" className="w-4 h-4" alt="GitHub" />
                    Continue with Github
                </button>

                {/* Figma Button */}
                <button className="register-signin-btn mt-5" onClick={handleSinginWithFigma}>
                    <img src="/assets/figma.png" className="w-4 h-4" alt="Figma" />
                    Continue with Figma
                </button>

                {/* Email Section */}
                <div className="register-email-section mt-10">
                    <label className="register-email-label uppercase tracking-wider font-bold">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email address..."
                        className="register-email-input"
                    />
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2.5 leading-relaxed">
                        Use an organization email to easily collaborate with teammates
                    </p>
                </div>

                {/* Continue Button */}
                <button className="register-continue-btn">
                    Continue
                </button>
            </div>

            {/* Footer - Bottom */}
            <div className="register-footer mt-12">
                <span className="opacity-50">© Defcon systems</span>
                <span className="register-footer-link">Privacy</span>
                <span className="register-footer-link">Support</span>
                <span className="register-footer-link">Pricing</span>
                <span className="register-footer-link">Log out</span>
            </div>
        </div>
    );

};

export default Register;
