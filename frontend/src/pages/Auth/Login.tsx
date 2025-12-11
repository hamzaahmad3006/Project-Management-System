import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, loginwithgoogle } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { MdCelebration } from 'react-icons/md';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../config/firebase';
import axios from 'axios';


const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

            // Dispatch Redux thunk and wait for it
            const payload = await dispatch(loginwithgoogle({
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL
            })).unwrap();  // unwrap will throw if rejected

            // Navigate only if login success
            navigate('/');
            window.toastify("Signin successful", "success");
        } catch (err) {
            console.error("Google sign in error:", err);
        }
    };


    return (
        <div className="login-container">

            {/* Logo - Top */}
            <div className="login-logo-main-div">
                <div className="login-logo-div">
                    <img src="/assets/logo.png" alt="DEFCON Logo" className="login-logo-img" />
                </div>
            </div>

            {/* Main Content - Center */}
            <div className="login-card">

                {/* Left Section */}
                <div className="login-left-section-main-div ">
                    <div className="login-left-section-title">
                        <div className="login-left-section-title-badge"><MdCelebration size={12} color='white' />NEW</div>
                        <h2 className="login-left-section-title-text">Reporting Dashboard</h2>
                    </div>

                    <div className="login-left-section-description">

                        <p className="login-left-section-description-text">
                            Our all-new Reporting Dashboard lets you build custom
                            reports and visualize project data with charts, KPIs,
                            and real-time filters — giving you clearer insights to
                            make smarter decisions.
                            <span className="text-[#DF9100] cursor-pointer ml-1">Learn more</span>
                        </p>
                    </div>


                    <div className="login-left-section-box">
                        <div className="login-left-section-box-inner"></div>
                    </div>
                </div>


                {/* Right Section */}
                <div className="login-right-section-main-div">
                    <h2 className="login-right-section-title">Log in to your account</h2>


                    {/* Email */}
                    <label className="login-right-section-label">Email Address *</label>
                    <input
                        type="email"
                        placeholder="name@company.com"
                        className="login-right-section-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />


                    {/* Password */}
                    <div className="login-right-section-password">
                        <label className="login-right-section-password-label">Password *</label>
                        <button className="login-right-section-forgot-password-button">Forgot password?</button>
                    </div>
                    <input
                        type="password"
                        placeholder="Password"
                        className="login-right-section-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />


                    <button
                        className="login-right-section-button"
                        onClick={handleSubmit}
                    >
                        Log in
                    </button>


                    {/* Google & Microsoft */}
                    <div className="login-right-section-google-microsoft">
                        <button
                            className="login-right-section-google-microsoft-button"
                            onClick={handleSigninWithGoogle}
                        >
                            <span className="text-lg "><img src="/assets/google.png" alt="Google" className='w-4 h-4' /></span> Google
                        </button>
                        <button className="login-right-section-google-microsoft-button">
                            <span className="text-lg "><img src="/assets/microsoft.png" alt="Microsoft" className='w-4 h-4' /></span> Microsoft
                        </button>
                    </div>


                    {/* SSO Section */}
                    <button className="login-right-section-sso">
                        Sign in with your identity provider (SSO/SAML)
                    </button>


                    <div className="login-right-section-or">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="login-right-section-or-span">OR</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>


                    <p className="text-center login-right-section-or-span-span">
                        Don't have an account?
                    </p>
                    <div className="flex items-center justify-center">
                        <button onClick={() => navigate('/auth/register')} className="w-[170px] text-[#F57D2C] font-medium text-sm inline-flex border-solid justify-center !border !border-[#E2E2E2] appearance-none outline-none mt-4 py-2 rounded-md hover:bg-gray-100 transition">
                            Sign up for free
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );


};

export default Login;
