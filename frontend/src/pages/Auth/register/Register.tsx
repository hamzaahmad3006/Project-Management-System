import React from 'react';
import { useRegister } from './useRegister';
import InputForm from 'components/ui/inputFields/InputForm';
import SocialAuthButton from 'components/ui/buttons/SocialAuthButton';
import { Loader } from 'lucide-react';
import { ButtonLoader } from 'components/loader/Loader';


const Register: React.FC = () => {
    const { formData, handleChange, handleSubmit, handleSinginWithGoogle, handleSigninWithGithub, handleSinginWithFigma, loading } = useRegister();
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
                <SocialAuthButton
                    label="Continue with Google"
                    iconSrc="/assets/google.png"
                    onClick={handleSinginWithGoogle}
                />


                {/* GitHub Button */}
                <SocialAuthButton
                    label="Continue with GitHub"
                    iconSrc="/assets/github.png"
                    onClick={handleSigninWithGithub}
                />

                {/* Figma Button */}
                <SocialAuthButton
                    label="Continue with Figma"
                    iconSrc="/assets/figma.png"
                    onClick={handleSinginWithFigma}
                />

                {/* Email Section */}
                <form onSubmit={handleSubmit} className="mt-10">
                    <InputForm
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        className="py-2.5 px-4 transition-all"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2.5 leading-relaxed">
                        Use an organization email to easily collaborate with teammates
                    </p>

                    {/* Continue Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-[36px] bg-[#6696F5] dark:bg-blue-600 text-white py-2.5 rounded-md mt-5 hover:bg-blue-600 dark:hover:bg-blue-700 transition text-sm font-medium shadow-sm flex items-center justify-center gap-2"
                    >
                        {loading ? <ButtonLoader /> : "Continue"}
                    </button>
                </form>
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
