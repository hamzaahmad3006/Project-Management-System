import React, { ChangeEvent } from "react";

export interface FileInputFormProps {
    label?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    disabled?: boolean;
    className?: string;       // input wrapper
    labelClassName?: string;  // label styling
    id?: string;
}

const FileInputForm: React.FC<FileInputFormProps> = ({
    label = "Upload",
    onChange,
    accept = "*",
    disabled = false,
    className = "",
    labelClassName = "",
    id,
}) => {
    const inputId = id || `file-input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <label
            htmlFor={inputId}
            className={`
        px-3 py-2 cursor-pointer border rounded-md text-sm
        bg-white dark:bg-gray-800
        text-gray-700 dark:text-gray-300
        border-gray-300 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-700
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${labelClassName}
        ${className}
      `}
        >
            {label}
            <input
                type="file"
                id={inputId}
                accept={accept}
                onChange={onChange}
                className="hidden"
                disabled={disabled}
            />
        </label>
    );
};

export default FileInputForm;
