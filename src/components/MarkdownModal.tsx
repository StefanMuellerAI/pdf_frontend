import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  markdownPath: string;
}

export function MarkdownModal({ isOpen, onClose, title, markdownPath }: MarkdownModalProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch(markdownPath)
        .then(response => response.text())
        .then(text => setContent(text))
        .catch(error => console.error('Error loading markdown:', error));
    }
  }, [isOpen, markdownPath]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl sm:p-6">
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div>
              <div className="w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                  {title}
                </h3>
                <div className="mt-2 max-h-[70vh] overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 