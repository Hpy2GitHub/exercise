// components/EmptyState.tsx
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddExercise: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddExercise }) => {
  return (
    <div className="text-center py-12">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">No Exercises Yet</h3>
        <p className="text-gray-600 mb-6">Add your first exercise to get started!</p>
        <button
          onClick={onAddExercise}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mx-auto"
        >
          <Plus size={20} />
          Add Your First Exercise
        </button>
      </div>
    </div>
  );
};
