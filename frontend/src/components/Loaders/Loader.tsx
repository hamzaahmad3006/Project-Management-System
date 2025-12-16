import { CircularProgress } from "@mui/material";

const Loader: React.FC = () => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <CircularProgress
                size={48}
            />
        </div>
    );
};

export default Loader;