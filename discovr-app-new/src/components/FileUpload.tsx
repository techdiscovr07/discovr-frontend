import React, { useRef, useState } from 'react';
import { Upload, X, File, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import './FileUpload.css';

interface FileUploadProps {
    accept?: string;
    maxSize?: number; // in MB
    multiple?: boolean;
    onFileSelect: (files: File[]) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    currentFiles?: Array<{ name: string; url?: string }>;
    onRemove?: (index: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    accept,
    maxSize = 50,
    multiple = false,
    onFileSelect,
    label = 'Upload File',
    description,
    disabled = false,
    currentFiles = [],
    onRemove
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const validateFile = (file: File): string | null => {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            return `${file.name} exceeds maximum size of ${maxSize}MB`;
        }

        // Validate file type if accept is specified
        if (accept) {
            const acceptedTypes = accept.split(',').map(type => type.trim());
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            const fileType = file.type.toLowerCase();
            
            const isAccepted = acceptedTypes.some(acceptedType => {
                // Handle MIME types (e.g., "video/*", "image/png")
                if (acceptedType.includes('/')) {
                    if (acceptedType.endsWith('/*')) {
                        const baseType = acceptedType.split('/')[0];
                        return fileType.startsWith(baseType + '/');
                    }
                    return fileType === acceptedType;
                }
                // Handle extensions (e.g., ".mp4", ".pdf")
                if (acceptedType.startsWith('.')) {
                    return fileExtension === acceptedType.toLowerCase();
                }
                return false;
            });

            if (!isAccepted) {
                return `${file.name} is not an accepted file type. Accepted: ${accept}`;
            }
        }

        // Validate file name for security (prevent path traversal)
        if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
            return `${file.name} contains invalid characters`;
        }

        return null;
    };

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const newErrors: string[] = [];
        const validFiles: File[] = [];

        fileArray.forEach(file => {
            const error = validateFile(file);
            if (error) {
                newErrors.push(error);
            } else {
                validFiles.push(file);
            }
        });

        setErrors(newErrors);
        
        if (validFiles.length > 0) {
            const filesToAdd = multiple ? [...selectedFiles, ...validFiles] : validFiles;
            setSelectedFiles(filesToAdd);
            onFileSelect(filesToAdd);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (disabled) return;
        
        handleFiles(e.dataTransfer.files);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleRemove = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        onFileSelect(newFiles);
    };

    const handleRemoveCurrent = (index: number) => {
        if (onRemove) {
            onRemove(index);
        }
    };

    return (
        <div className="file-upload">
            {label && (
                <label className="file-upload-label">{label}</label>
            )}
            
            {description && (
                <p className="file-upload-description">{description}</p>
            )}

            {/* Current Files Display */}
            {currentFiles.length > 0 && (
                <div className="file-upload-current">
                    <p className="file-upload-current-label">Current Files:</p>
                    {currentFiles.map((file, index) => (
                        <div key={index} className="file-upload-item">
                            <File size={16} />
                            <span className="file-upload-item-name">
                                {file.name}
                            </span>
                            {file.url && (
                                <a 
                                    href={file.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="file-upload-item-link"
                                >
                                    View
                                </a>
                            )}
                            {onRemove && (
                                <button
                                    type="button"
                                    className="file-upload-item-remove"
                                    onClick={() => handleRemoveCurrent(index)}
                                    aria-label="Remove file"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Selected Files Display */}
            {selectedFiles.length > 0 && (
                <div className="file-upload-selected">
                    <p className="file-upload-selected-label">Selected Files:</p>
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="file-upload-item">
                            <CheckCircle size={16} className="file-upload-item-check" />
                            <span className="file-upload-item-name">
                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                            <button
                                type="button"
                                className="file-upload-item-remove"
                                onClick={() => handleRemove(index)}
                                aria-label="Remove file"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            <div
                className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleInputChange}
                    disabled={disabled}
                    className="file-upload-input"
                />
                <div className="file-upload-content">
                    <Upload size={32} className="file-upload-icon" />
                    <p className="file-upload-text">
                        <span className="file-upload-text-highlight">Click to upload</span> or drag and drop
                    </p>
                    <p className="file-upload-hint">
                        {accept ? `Accepted: ${accept}` : 'Any file type'} • Max {maxSize}MB
                    </p>
                </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="file-upload-errors">
                    {errors.map((error, index) => (
                        <p key={index} className="file-upload-error">
                            {error}
                        </p>
                    ))}
                </div>
            )}

            {/* Manual Upload Button */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                style={{ marginTop: 'var(--space-2)' }}
            >
                <Upload size={16} />
                Choose Files
            </Button>
        </div>
    );
};
