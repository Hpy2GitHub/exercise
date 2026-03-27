// components/PrintButton.tsx
import { ComponentType } from 'react';
import { Printer } from 'lucide-react';
import { features } from "../config/features";

export const PrintButton: React.FC = () => {
  const handlePrint = () => {
    // Add print-specific classes before printing
    document.body.classList.add('printing');
    window.print();
    // Remove after printing
    setTimeout(() => {
      document.body.classList.remove('printing');
    }, 1000);
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition no-print"
      title="Print this list"
    >
      <Printer size={18} />
      Print List
    </button>
  );
};
