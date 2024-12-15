import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FileUpload } from './components/FileUpload';
import { CategorySelector } from './components/CategorySelector';
import { ProcessingModal } from './components/ProcessingModal';
import type { 
  FileUploadState, 
  ProcessPreferences,
  AnonymizationOption,
  UploadResponse,
  ProcessingStatus,
  ApiError
} from './types';

const API_URL = import.meta.env.VITE_API_URL;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

function App() {
  const [fileState, setFileState] = useState<FileUploadState>({ file: null, error: null });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ currentPage?: number; totalPages?: number }>({});

  // Define fixed anonymization options
  const anonymizationOptions: AnonymizationOption[] = [
    {
      id: 'emails',
      label: 'Email Addresses',
      description: 'Detect and anonymize email addresses'
    },
    {
      id: 'names',
      label: 'Names',
      description: 'Detect and anonymize personal names'
    },
    {
      id: 'phone_numbers',
      label: 'Phone Numbers',
      description: 'Detect and anonymize phone numbers'
    }
  ];

  const handleFileChange = (file: File | null, error: ApiError | null) => {
    setFileState({ file, error });
    if (file && !error) {
      setSelectedCategories(['emails', 'names', 'phone_numbers']);
    } else {
      setSelectedCategories([]);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCategories(anonymizationOptions.map(option => option.id));
  };

  const handleDeselectAll = () => {
    setSelectedCategories([]);
  };

  const handleSubmit = async () => {
    if (!fileState.file || selectedCategories.length === 0) return;

    try {
      setIsProcessing(true);
      setFileState(prev => ({ ...prev, error: null }));

      const formData = new FormData();
      formData.append('file', fileState.file);

      const preferences: ProcessPreferences = {
        emails: selectedCategories.includes('emails'),
        names: selectedCategories.includes('names'),
        phone_numbers: selectedCategories.includes('phone_numbers')
      };

      formData.append('preferences', JSON.stringify(preferences));

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setFileState(prev => ({ ...prev, error: data as ApiError }));
        setIsProcessing(false);
        return;
      }

      const uploadResponse = data as UploadResponse;
      setTaskId(uploadResponse.task_id);

    } catch (err) {
      const error: ApiError = {
        error: 'Upload failed',
        message: 'Failed to upload file',
        details: {
          technical_error: err instanceof Error ? err.message : 'Unknown error',
          suggestion: 'Please try again or contact support if the problem persists.'
        }
      };
      setFileState(prev => ({ ...prev, error }));
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!taskId) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/status/${taskId}`, {
          headers: {
            'Accept': 'application/json, application/pdf',
            'Authorization': `Bearer ${BEARER_TOKEN}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          setFileState(prev => ({ 
            ...prev, 
            error: errorData as ApiError 
          }));
          setIsProcessing(false);
          setTaskId(null);
          return;
        }

        // Check if the response is a PDF
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/pdf')) {
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);

          const downloadLink = document.createElement('a');
          downloadLink.style.display = 'none';
          downloadLink.href = downloadUrl;
          downloadLink.download = 'anonymized.pdf';
          document.body.appendChild(downloadLink);
          downloadLink.click();

          // Cleanup
          setTimeout(() => {
            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(downloadUrl);
          }, 100);

          // Reset states
          setIsProcessing(false);
          setTaskId(null);
          setFileState({ file: null, error: null });
          setSelectedCategories([]);
          setProgress({});
          return;
        }

        // If not PDF, then it's a status update
        const status: ProcessingStatus = await response.json();
        if (status.status === 'Failed') {
          setFileState(prev => ({
            ...prev,
            error: {
              error: 'Processing failed',
              message: status.error || 'An unknown error occurred during processing',
              details: {
                suggestion: 'Please try again or contact support if the problem persists.'
              }
            }
          }));
          setIsProcessing(false);
          setTaskId(null);
          return;
        }

        setProgress({
          currentPage: status.current_page,
          totalPages: status.total_pages
        });

      } catch (err) {
        setFileState(prev => ({
          ...prev,
          error: {
            error: 'Status check failed',
            message: 'Failed to check processing status',
            details: {
              technical_error: err instanceof Error ? err.message : 'Unknown error',
              suggestion: 'Please try again or contact support if the problem persists.'
            }
          }
        }));
        setIsProcessing(false);
        setTaskId(null);
      }
    };

    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, [taskId]);

  const canSubmit = fileState.file && 
    selectedCategories.length > 0 && 
    !fileState.error;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            <FileUpload
              fileState={fileState}
              onFileChange={handleFileChange}
            />

            {fileState.file && !fileState.error && (
              <CategorySelector
                categories={anonymizationOptions}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
              />
            )}

            {canSubmit && (
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isProcessing ? 'Processing...' : 'Anonymize PDF'}
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ProcessingModal 
        isOpen={isProcessing}
        currentPage={progress.currentPage}
        totalPages={progress.totalPages}
      />
    </div>
  );
}

export default App;