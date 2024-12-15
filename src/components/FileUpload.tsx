import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertTriangle } from 'lucide-react';
import type { FileUploadState, ApiError } from '../types';
import { ErrorDisplay } from './ErrorDisplay';

interface FileUploadProps {
  fileState: FileUploadState;
  onFileChange: (file: File | null, error: ApiError | null) => void;
}

export function FileUpload({ fileState, onFileChange }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file?.type !== 'application/pdf') {
      onFileChange(null, {
        error: 'Invalid file type',
        message: 'Please upload a PDF file',
        details: {
          filename: file?.name,
          suggestion: 'Please select a file with .pdf extension.'
        }
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      onFileChange(null, {
        error: 'File too large',
        message: 'File size must be less than 10MB',
        details: {
          suggestion: 'Please select a smaller file or compress the current one.'
        }
      });
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
    <div className="w-full space-y-4">
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
      
      {fileState.error && <ErrorDisplay error={fileState.error} />}
      
      {fileState.file && !fileState.error && (
        <div className="mt-2 text-sm text-gray-600">
          <p>Selected file: {fileState.file.name}</p>
          <p>Size: {(fileState.file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      <div className="flex items-start space-x-2 bg-red-50 px-4 py-3 rounded-md">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-red-800">
          <p className="font-medium">Demo Version</p>
          <p>This application is for demonstration purposes only and uses Mistral_Large_Latest as LLM. Please do not upload sensitive production data.</p>
        </div>
      </div>
    </div>
  );
}