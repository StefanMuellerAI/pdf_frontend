import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertTriangle, X } from 'lucide-react';
import type { FileUploadState, ApiError } from '../types';
import { ErrorDisplay } from './ErrorDisplay';

interface FileUploadProps {
  fileState: FileUploadState;
  onFileChange: (file: File | null, error: ApiError | null) => void;
}

export function FileUpload({ fileState, onFileChange }: FileUploadProps) {
  const validatePdf = async (file: File): Promise<{ isValid: boolean; pageCount?: number }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          // Check for PDF magic number (%PDF-)
          const firstBytes = new Uint8Array(arrayBuffer.slice(0, 5));
          const magicNumber = String.fromCharCode(...firstBytes);
          if (magicNumber !== '%PDF-') {
            resolve({ isValid: false });
            return;
          }

          // Count pages by looking for /Page objects
          const text = String.fromCharCode(...new Uint8Array(arrayBuffer));
          const pageMatches = text.match(/\/Type\s*\/Page[^s]/g);
          const pageCount = pageMatches ? pageMatches.length : 0;
          
          resolve({ isValid: true, pageCount });
        } catch (error) {
          resolve({ isValid: false });
        }
      };
      reader.onerror = () => resolve({ isValid: false });
      reader.readAsArrayBuffer(file);
    });
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null, null);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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

    // Validate PDF structure and page count
    const { isValid, pageCount } = await validatePdf(file);
    
    if (!isValid) {
      onFileChange(null, {
        error: 'Invalid PDF file',
        message: 'The file appears to be corrupted or is not a valid PDF',
        details: {
          filename: file.name,
          suggestion: 'Please ensure the file is a valid PDF document and try again.'
        }
      });
      return;
    }

    if (pageCount && pageCount > 10) {
      onFileChange(null, {
        error: 'Too many pages',
        message: `The PDF has ${pageCount} pages, but the maximum allowed is 10 pages`,
        details: {
          current_pages: pageCount,
          max_pages: 10,
          suggestion: 'Please split the document into smaller parts or select a shorter document.'
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
        <div className="mt-2 text-sm text-gray-600 flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md">
          <div>
            <p>Selected file: {fileState.file.name}</p>
            <p>Size: {(fileState.file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button
            onClick={handleRemoveFile}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            title="Remove file"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      )}

      <div className="flex items-start space-x-2 bg-red-50 px-4 py-3 rounded-md">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-red-800">
          <p className="font-medium">Demo Version</p>
          <p>This application is for demonstration purposes only and uses Mistral_Large_Latest as LLM. Please do not upload sensitive production data. 10 Pages is the limit.</p>
        </div>
      </div>
    </div>
  );
}