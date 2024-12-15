import { Loader2 } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
  currentPage?: number;
  totalPages?: number;
}

export function ProcessingModal({ isOpen, currentPage, totalPages }: ProcessingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Processing PDF
                </h3>
                <div className="mt-2">
                  {totalPages ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        Processing page {currentPage} of {totalPages}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${((currentPage || 0) / totalPages) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Starting process...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}