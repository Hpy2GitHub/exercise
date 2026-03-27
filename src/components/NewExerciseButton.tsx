// NewExerciseButton.tsx
import { ComponentType, ButtonHTMLAttributes, MouseEventHandler } from 'react';
import { Plus } from 'lucide-react';

export interface NewExerciseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string; // This is already included in ButtonHTMLAttributes, but kept for clarity.
  iconSize?: number; 
}

export const NewExerciseButton = ({ 
  onClick, 
  className = '', 
  iconSize = 20,
  ...props
}: NewExerciseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition ${className}`}
      {...props}
    >
      <Plus size={iconSize} />
      New Exercise
    </button>
  );
};
