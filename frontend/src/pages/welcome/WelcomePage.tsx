import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store/hooks';
import { completeWelcome } from 'store/slices/authSlice';

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleGetStarted = async () => {
        try {
            await dispatch(completeWelcome()).unwrap();
            navigate('/');
        } catch (error) {
            console.error('Failed to complete welcome:', error);
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="max-w-4xl w-full flex flex-col items-center justify-center text-center">
                <div className="mb-10">
                    <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center p-4 shadow-xl transform  hover:rotate-0 transition-transform duration-300">
                        <div className='text-4xl font-bold '> ❖</div>
                    </div>
                </div>

                <h1 className="text-5xl md:text-5xl font-semibold font-inter text-gray-900 mb-8 tracking-tight">
                    Welcome To Defcon
                </h1>

                <p className="text-xl text-gray-900 mb-12 max-w-2xl leading-relaxed font-medium text-[24px]">
                    Welcome to your Project Management Dashboard. Track progress, manage tasks, and keep your team aligned.
                </p>

                <button
                    onClick={handleGetStarted}
                    className="w-full max-w-sm bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2  shadow-xl shadow-blue-200 transform hover:-translate-y-1 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 text-lg"
                >
                    Get Started
                </button>

                <div className="mt-16 text-gray-300 text-sm font-semibold tracking-widest uppercase">
                    Defcon Productivity Suite
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
