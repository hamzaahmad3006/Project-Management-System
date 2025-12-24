import React from 'react';
import { useRegister } from './useRegister';


const Register: React.FC = () => {
    const { handleSinginWithGoogle, handleSigninWithGithub, handleSinginWithFigma } = useRegister();
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-around bg-white dark:bg-[#12141c] px-4 py-8 font-inter transition-colors duration-300">
            {/* Logo - Top */}
            <div className="flex items-center justify-between gap-3 mt-8">
                <div className="w-full h-full rounded-md flex items-center justify-center">
                    <img src="/assets/logo.png" alt="DEFCON Logo" className="w-[173px] h-[42px] object-contain" />
                </div>
            </div>

            {/* Main Content - Center */}
            <div className="w-full max-w-[400px]">
                {/* Title */}
                <h2 className="text-center text-2xl font-medium mb-8 text-[#25272D] dark:text-gray-100 uppercase tracking-tight">Sign up</h2>

                {/* Google Button */}
                <button className="w-full bg-white dark:bg-gray-800 border-solid !border-2 !border-[#E2E4E9] dark:border-gray-700 rounded-md py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-medium text-[#25272D] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm" onClick={handleSinginWithGoogle}>
                    <img src="/assets/google.png" className="w-4 h-4" alt="Google" />
                    Continue with Google
                </button>

                {/* GitHub Button */}
                <button className="w-full bg-white dark:bg-gray-800 border-solid !border-2 !border-[#E2E4E9] dark:border-gray-700 rounded-md py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-medium text-[#25272D] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm mt-5" onClick={handleSigninWithGithub}>
                    <img src="/assets/github.png" className="w-4 h-4" alt="GitHub" />
                    Continue with Github
                </button>

                {/* Figma Button */}
                <button className="w-full bg-white dark:bg-gray-800 border-solid !border-2 !border-[#E2E4E9] dark:border-gray-700 rounded-md py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-medium text-[#25272D] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm mt-5" onClick={handleSinginWithFigma}>
                    <img src="/assets/figma.png" className="w-4 h-4" alt="Figma" />
                    Continue with Figma
                </button>

                {/* Email Section */}
                <div className="mt-10">
                    <label className="block text-xs text-[#8F929C] dark:text-gray-500 mb-2 uppercase tracking-wider font-bold">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email address..."
                        className="w-full h-[36px] bg-white dark:bg-gray-800 border border-[#E2E4E9] dark:border-gray-700 py-2.5 px-4 text-sm font-medium text-[#25272D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-800 transition-all rounded-md"
                    />
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2.5 leading-relaxed">
                        Use an organization email to easily collaborate with teammates
                    </p>
                </div>

                {/* Continue Button */}
                <button className="w-full h-[36px] bg-[#6696F5] dark:bg-blue-600 text-white py-2.5 rounded-md mt-5 hover:bg-blue-600 dark:hover:bg-blue-700 transition text-sm font-medium shadow-sm">
                    Continue
                </button>
            </div>

            {/* Footer - Bottom */}
            <div className="mb-8 text-xs text-gray-500 dark:text-gray-500 flex flex-wrap gap-4 justify-center items-center mt-12">
                <span className="opacity-50">© Defcon systems</span>
                <span className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy</span>
                <span className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Support</span>
                <span className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Pricing</span>
                <span className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Log out</span>
            </div>
        </div>
    );

};

export default Register;
