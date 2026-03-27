// src/views/ExerciseTableView.tsx
import React from 'react';
import { ExerciseTable } from '../components/ExerciseTable';
import { Exercise } from '../types';  // Changed import to types

export interface ExerciseTableViewProps {
  exercises: Exercise[];
  onEdit: (index: number) => void;
  onViewDetails: (index: number) => void;
  onBack: () => void;
  onAddExercise: () => void;
}

export const ExerciseTableView: React.FC<ExerciseTableViewProps> = ({
  exercises,
  onEdit,
  onViewDetails,
  onBack,
  onAddExercise,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <ExerciseTable  
          exercises={exercises}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
          onBack={onBack}
          onAddExercise={onAddExercise}
        />
      </div>
    </div>
  );
};
