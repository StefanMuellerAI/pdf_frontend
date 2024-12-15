import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { FileUploadState } from '../types';

interface FileUploadProps {
  fileState: FileUploadState;
  onFileChange: (file: File | null, error: string | null) => void;
}

export function FileUpload({ fileState, onFileChange }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file?.type !== 'application/pdf') {
      onFileChange(null, 'Please upload a PDF file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      onFileChange(null, 'File size must be less than 10MB');
      return;
    }
    onFileChange(file, null);
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? 'Drop the PDF here' : 'Drag and drop a PDF file here, or click to select'}
        </p>
      </div>
      
      {fileState.error && (
        <p className="mt-2 text-sm text-red-600">{fileState.error}</p>
      )}
      
      {fileState.file && !fileState.error && (
        <div className="mt-2 text-sm text-gray-600">
          <p>Selected file: {fileState.file.name}</p>
          <p>Size: {(fileState.file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}
    </div>
  );
}