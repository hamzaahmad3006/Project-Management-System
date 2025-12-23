import { CircularProgress } from "@mui/material";
import { LoaderProps } from "../../types";



const Loader: React.FC<LoaderProps> = ({ size = 48, color = "primary" }) => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <CircularProgress size={size} color={color} />
        </div>
    );
};


export default Loader;