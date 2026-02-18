import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    showPasswordToggle?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    type,
    showPasswordToggle,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const shouldShowToggle = showPasswordToggle !== false && isPasswordType;
    const inputType = isPasswordType && showPassword ? 'text' : type;

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label className="input-label">
                    {label}
                    {props.required && <span className="input-required">*</span>}
                </label>
            )}
            <div className={`input-container ${error ? 'input-error' : ''}`}>
                {leftIcon && <span className="input-icon-left">{leftIcon}</span>}
                <input
                    className="input"
                    type={inputType}
                    {...props}
                />
                {shouldShowToggle && (
                    <button
                        type="button"
                        className="input-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
                {rightIcon && !shouldShowToggle && <span className="input-icon-right">{rightIcon}</span>}
            </div>
            {error && <span className="input-error-text">{error}</span>}
            {helperText && !error && <span className="input-helper-text">{helperText}</span>}
        </div>
    );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
    label,
    error,
    helperText,
    className = '',
    ...props
}) => {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label className="input-label">
                    {label}
                    {props.required && <span className="input-required">*</span>}
                </label>
            )}
            <div className={`input-container ${error ? 'input-error' : ''}`}>
                <textarea
                    className="input textarea"
                    {...props}
                />
            </div>
            {error && <span className="input-error-text">{error}</span>}
            {helperText && !error && <span className="input-helper-text">{helperText}</span>}
        </div>
    );
};
