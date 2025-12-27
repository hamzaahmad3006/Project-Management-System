import React from "react";

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface SelectFormProps {
    label?: string;
    name: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    icon?: React.ReactNode;
    className?: string;
    labelClassName?: string;
    containerClassName?: string;
    error?: string;
    id?: string;
}

const SelectField: React.FC<SelectFormProps> = ({
    label,
    name,
    value,
    onChange,
    options,
    placeholder = "Select option",
    disabled = false,
    required = false,
    icon,
    className = "",
    labelClassName = "",
    containerClassName = "",
    error,
    id,
}) => {
    const selectId = id || name;

    return (
        <div className={`flex flex-col gap-1 w-full ${containerClassName}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className={`text-sm font-medium ${labelClassName}`}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative w-full">
                <select
                    id={selectId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full appearance-none border rounded-md
            px-3 py-2 text-sm outline-none
            bg-white dark:bg-gray-800
            text-gray-700 dark:text-gray-200
            ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
            ${className}`}
                >
                    {placeholder && <option value="">{placeholder}</option>}

                    {options.length === 0 ? (
                        <option value="">No options found</option>
                    ) : (
                        options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))
                    )}
                </select>

                {/* Dropdown Icon */}
                {icon && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
                        {icon}
                    </span>
                )}
            </div>

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default SelectField;
