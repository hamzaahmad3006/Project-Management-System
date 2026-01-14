import { FaSpinner } from "react-icons/fa";

export const Loader: React.FC<{ fullscreen?: boolean }> = ({ fullscreen = true }) => {
    const containerClasses = fullscreen
        ? "fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#12141c]"
        : "w-full py-20 flex items-center justify-center bg-transparent";

    return (
        <div className={containerClasses}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
            </div>
        </div>
    );
};

export const ButtonLoader = () => {
    return (
        <FaSpinner className="animate-spin" />
    );
};