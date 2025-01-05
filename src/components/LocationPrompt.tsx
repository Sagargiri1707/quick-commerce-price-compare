import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationPromptProps {
  error: string | null;
  onRetry: () => void;
}

export default function LocationPrompt({ error, onRetry }: LocationPromptProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <MapPin className="w-12 h-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Enable Location Access</h2>
          <p className="text-gray-600 mb-4">
            {error || 'We need your location to show you the best prices from nearby stores'}
          </p>
          <button
            onClick={onRetry}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Enable Location
          </button>
        </div>
      </div>
    </div>
  );
}