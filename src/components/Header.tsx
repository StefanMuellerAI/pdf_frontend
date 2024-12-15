import { Eraser, AlertTriangle } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start">
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
          
          <div className="flex items-start space-x-2 bg-red-50 px-4 py-2 rounded-md max-w-md">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Demo Version</p>
              <p>This application is for demonstration purposes only and uses Mistral_Large_Latest as LLM. Please do not upload sensitive production data.</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}