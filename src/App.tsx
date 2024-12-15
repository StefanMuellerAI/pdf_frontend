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
  ProcessingStatus
} from './types';

const API_URL = import.meta.env.VITE_API_URL;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

function App() {
  const [fileState, setFileState] = useState<FileUploadState>({ file: null, error: null });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleFileChange = (file: File | null, error: string | null) => {
    setFileState({ file, error });
    setError(null);
    if (file && !error) {
      // Set default selections
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
      setError(null);

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

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data: UploadResponse = await response.json();
      setTaskId(data.task_id);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsProcessing(false);
      setTaskId(null);
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
          throw new Error('Failed to check status');
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
        setProgress({
          currentPage: status.current_page,
          totalPages: status.total_pages
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check status');
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

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
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