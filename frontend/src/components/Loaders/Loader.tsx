import { CircularProgress } from "@mui/material";

const Loader: React.FC = () => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <CircularProgress
                size={48}          // 3rem = 48px
            // enableTrackSlot is allowed in MUI v6+
            />
        </div>
    );
};

export default Loader;
