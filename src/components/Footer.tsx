import { useState } from 'react';
import { MarkdownModal } from './MarkdownModal';

export function Footer() {
  const [showImprint, setShowImprint] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <span>© 2024 Redact-o-mat by </span>
            <a 
              href="https://stefanai.de" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 hover:text-indigo-500"
            >
              StefanAI
            </a>
            <span className="mx-2">|</span>
            <button onClick={() => setShowImprint(true)} className="hover:text-gray-700">
              Imprint
            </button>
            <span className="mx-2">|</span>
            <button onClick={() => setShowPrivacy(true)} className="hover:text-gray-700">
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>

      <MarkdownModal
        isOpen={showImprint}
        onClose={() => setShowImprint(false)}
        title="Imprint"
        markdownPath="/imprint.md"
      />

      <MarkdownModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
        markdownPath="/privacy_policy.md"
      />
    </>
  );
}