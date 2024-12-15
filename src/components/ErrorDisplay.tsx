import { AlertTriangle } from 'lucide-react';
import type { ApiError } from '../types';

interface ErrorDisplayProps {
  error: ApiError;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {error.error}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message}</p>
            {error.details && (
              <div className="mt-4 space-y-2">
                {error.details.suggestion && (
                  <p className="text-sm">
                    <span className="font-medium">Suggestion: </span>
                    {error.details.suggestion}
                  </p>
                )}
                {error.details.current_pages && (
                  <p className="text-sm">
                    <span className="font-medium">Current Pages: </span>
                    {error.details.current_pages}
                  </p>
                )}
                {error.details.max_pages && (
                  <p className="text-sm">
                    <span className="font-medium">Maximum Pages: </span>
                    {error.details.max_pages}
                  </p>
                )}
                {error.details.filename && (
                  <p className="text-sm">
                    <span className="font-medium">Filename: </span>
                    {error.details.filename}
                  </p>
                )}
                {error.details.technical_error && (
                  <p className="text-sm font-mono bg-red-100 p-2 rounded">
                    {error.details.technical_error}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 