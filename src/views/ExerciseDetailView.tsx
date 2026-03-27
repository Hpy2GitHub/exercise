// src/views/ExerciseDetailView.tsx
import React from 'react';
import { ExerciseDetail } from '../components/ExerciseDetail';
import { Exercise, ExerciseList, MuscleDiagramData } from '../types';  // Changed import to types

interface ExerciseDetailViewProps {
  exercise: Exercise | null;
  lists?: ExerciseList[];
  onBack: () => void;
  onEdit: () => void;
  onToggleList?: (listIndex: number, exerciseKey: string) => void;
  muscleDiagramData?: MuscleDiagramData;
}

export const ExerciseDetailView: React.FC<ExerciseDetailViewProps> = ({ 
  exercise, 
  lists = [],
  onBack, 
  onEdit,
  onToggleList,
  muscleDiagramData 
}) => {
  console.log('ExerciseDetailView - Exercise:', exercise);
  console.log('ExerciseDetailView - MuscleDiagramData:', muscleDiagramData);
  console.log('ExerciseDetailView - Has data?', !!muscleDiagramData);
  console.log('ExerciseDetailView - Lists:', lists);
  
  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Exercise not found</p>
      </div>
    );
  }

  return (
    <ExerciseDetail
      exercise={exercise}
      lists={lists}
      onBack={onBack}
      onEdit={onEdit}
      onToggleList={onToggleList}
      muscleDiagramData={muscleDiagramData || null}
    />
  );
};
