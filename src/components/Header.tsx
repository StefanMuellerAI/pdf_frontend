import { useState } from 'react';
import { Eraser, Info } from 'lucide-react';
import { InfoModal } from './InfoModal';

export function Header() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Eraser className="h-8 w-8 text-indigo-600" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">Redact-o-mat</h1>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    BETA
                  </span>
                </div>
                <p className="text-sm text-gray-500">Automatically redact sensitive information in your documents</p>
              </div>
            </div>

            <button
              onClick={() => setShowInfo(true)}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
            >
              <Info className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <InfoModal 
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
      />
    </>
  );
}