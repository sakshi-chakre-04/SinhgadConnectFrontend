import React, { useState } from 'react';

const FileUpload = ({ onFilesUploaded, maxFiles = 5 }) => {
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const handleFileSelect = async (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (files.length + selectedFiles.length > maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`);
            return;
        }

        setError('');
        setUploading(true);

        try {
            const uploadPromises = selectedFiles.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch((import.meta.env.VITE_API_URL || 'https://sinhgadconnectbackend.onrender.com/api') + '/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Upload failed');
                }

                const data = await response.json();
                return data.attachment;
            });

            const uploadedFiles = await Promise.all(uploadPromises);
            const newFiles = [...files, ...uploadedFiles];
            setFiles(newFiles);
            onFilesUploaded(newFiles);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onFilesUploaded(newFiles);
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'image': return '🖼️';
            case 'pdf': return '📄';
            default: return '📎';
        }
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                Attachments <span className="text-gray-400">(optional)</span>
            </label>

            {/* File input */}
            <div className="flex items-center gap-3">
                <label className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-all
                    ${uploading ? 'border-gray-300 bg-gray-50 cursor-wait' : 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50'}
                `}>
                    <span className="text-xl">📎</span>
                    <span className="text-sm text-gray-600">
                        {uploading ? 'Uploading...' : 'Add files'}
                    </span>
                    <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        onChange={handleFileSelect}
                        disabled={uploading || files.length >= maxFiles}
                        className="sr-only"
                    />
                </label>
                <span className="text-xs text-gray-400">
                    Max 10MB each · {files.length}/{maxFiles} files
                </span>
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {/* File previews */}
            {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 group"
                        >
                            {file.type === 'image' ? (
                                <img
                                    src={file.url}
                                    alt={file.filename}
                                    className="w-8 h-8 object-cover rounded"
                                />
                            ) : (
                                <span className="text-lg">{getFileIcon(file.type)}</span>
                            )}
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-700 max-w-[120px] truncate">
                                    {file.filename}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {formatSize(file.size)}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="ml-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
