import React from 'react';

export interface TextAreaFormProps {
  label?: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  labelClassName?: string;
  id?: string;
}

const TextAreaForm: React.FC<TextAreaFormProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  required = false,
  error,
  className = '',
  labelClassName = '',
  id,
}) => {
  const textareaId = id || name;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={textareaId} className={`text-sm font-medium ${labelClassName}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full px-3 py-2 rounded-md text-sm resize-none outline-none
          bg-white dark:bg-gray-800
          text-gray-800 dark:text-gray-100
          ${error ? 'border-red-500' : 'border border-gray-300 dark:border-gray-700'}
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          ${className}`}
      />

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default TextAreaForm;
