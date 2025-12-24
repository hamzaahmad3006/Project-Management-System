import React, { useState } from 'react';
import { MdCelebration } from 'react-icons/md';
import { useLoginHook } from './useLogin';




const Login: React.FC = () => {
    const { email, setEmail, password, setPassword, handleSubmit, handleSigninWithGoogle, navigate } = useLoginHook();

    return (
        <div className="min-h-screen w-full flex items-center justify-center flex-col bg-gray-50 dark:bg-[#12141c] p-4 font-inter transition-colors duration-300">

            {/* Logo - Top */}
            <div className="flex items-center justify-between mb-10">
                <div className="w-full h-full rounded-md flex items-center justify-center">
                    <img src="/assets/logo.png" alt="DEFCON Logo" className="w-[173px] h-[42px] object-contain" />
                </div>
            </div>

            {/* Main Content - Center */}
            <div className="w-full max-w-6xl bg-white dark:bg-[#1a1c23] shadow-md dark:shadow-none grid grid-cols-1 md:grid-cols-2 overflow-hidden dark:border dark:border-gray-800 rounded-xl">

                {/* Left Section */}
                <div className="p-10 bg-[#FCF9F7] dark:bg-[#16181d] border-r border-gray-200 dark:border-gray-800 flex flex-col justify-center">
                    <div className="flex items-center mb-6">
                        <div className="flex text-xs bg-[#DF9100] text-white px-1 font-semibold rounded-lg mr-2"><MdCelebration size={12} color='white' />NEW</div>
                        <h2 className="text-[16px] font-medium text-gray-800 dark:text-gray-200">Reporting Dashboard</h2>
                    </div>

                    <div className="flex justify-center items-center">
                        <p className="text-gray-600 dark:text-gray-400 font-normal text-sm leading-relaxed max-w-[390px]">
                            Our all-new Reporting Dashboard lets you build custom
                            reports and visualize project data with charts, KPIs,
                            and real-time filters — giving you clearer insights to
                            make smarter decisions.
                            <span className="text-[#DF9100] cursor-pointer ml-1">Learn more</span>
                        </p>
                    </div>


                    <div className="mt-10 w-full h-56 bg-[#FCF9F7] dark:bg-[#16181d] shadow-2xl dark:shadow-none flex items-end justify-center">
                        <div className="w-40 h-10 bg-white dark:bg-gray-800 shadow-2xl shadow-gray-700 dark:shadow-black"></div>
                    </div>
                </div>


                {/* Right Section */}
                <div className="p-10 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Log in to your account</h2>


                    {/* Email */}
                    <label className="text-sm font-medium text-[#2F2F2F] dark:text-gray-300">Email Address *</label>
                    <input
                        type="email"
                        placeholder="name@company.com"
                        className="w-full mt-1 mb-4 px-4 py-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 outline-none transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />


                    {/* Password */}
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-[#2F2F2F] dark:text-gray-300">Password *</label>
                        <button className="text-sm text-[#8E94BB] dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition">Forgot password?</button>
                    </div>
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full mt-1 mb-4 px-4 py-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 outline-none transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />


                    <button
                        className="w-full bg-[#6696F5] dark:bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-sm"
                        onClick={handleSubmit}
                    >
                        Log in
                    </button>


                    {/* Google & Microsoft */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <button
                            className="flex items-center gap-2 border dark:border-gray-700 px-4 py-2 text-[#F57D2C] rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            onClick={handleSigninWithGoogle}
                        >
                            <span className="text-lg "><img src="/assets/google.png" alt="Google" className='w-4 h-4' /></span> Google
                        </button>
                        <button className="flex items-center gap-2 border dark:border-gray-700 px-4 py-2 text-[#F57D2C] rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                            <span className="text-lg "><img src="/assets/microsoft.png" alt="Microsoft" className='w-4 h-4' /></span> Microsoft
                        </button>
                    </div>


                    {/* SSO Section */}
                    <button className="w-full inline-flex border-solid justify-center text-sm text-[#2F2F2F] dark:text-gray-300 !border !border-[#E2E2E2] dark:border-gray-700 appearance-none outline-none mt-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all bg-white dark:bg-gray-800">
                        Sign in with your identity provider (SSO/SAML)
                    </button>


                    <div className="flex items-center my-4">
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                        <span className="px-2 text-gray-500 dark:text-gray-500 text-sm">OR</span>
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                    </div>


                    <p className="text-center px-2 text-gray-500 dark:text-gray-500 text-sm">
                        Don't have an account?
                    </p>
                    <div className="flex items-center justify-center">
                        <button onClick={() => navigate('/auth/register')} className="w-[170px] text-[#F57D2C] font-semibold text-sm inline-flex border-solid justify-center !border !border-[#E2E2E2] dark:!border-gray-700 appearance-none outline-none mt-4 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-sm bg-white dark:bg-gray-800">
                            Sign up for free
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );


};

export default Login;
