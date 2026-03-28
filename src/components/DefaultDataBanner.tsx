// src/components/DefaultDataBanner.tsx
import React, { useState } from 'react';
import { Info, X, RotateCcw, Download } from 'lucide-react';
import { features } from "../config/features";

interface DefaultDataBannerProps {
  isVisible: boolean;
  onReset: () => void;
  onExport: () => void;
  onDismiss?: () => void;
}

export const DefaultDataBanner: React.FC<DefaultDataBannerProps> = ({
  isVisible,
  onReset,
  onExport,
  onDismiss
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isVisible || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
   <>
   {features.showDefaultDataBanner && (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Info className="text-indigo-600" size={20} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Using Sample Data
            </h3>
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
              You're currently viewing sample exercises. You can:
            </p>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                title="Reset to fresh sample data"
              >
                <RotateCcw size={16} />
                Reset to Defaults
              </button>
              
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition text-sm font-medium"
                title="Export current data"
              >
                <Download size={16} />
                Export Current Data
              </button>
              
              <button
                onClick={handleDismiss}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                title="Dismiss this message"
              >
                Got it
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
            title="Dismiss"
          >
            <X size={20} />
          </button>
        </div>

        {/* Additional tips */}
        <div className="mt-4 pt-4 border-t border-indigo-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>💡 Tip:</strong> Any changes you make will be automatically saved. 
            Use the Import button to load your own exercise database, or start editing the sample exercises to build your own collection.
          </p>
        </div>
      </div>
    </div>
  )}
  </>
  );
};
