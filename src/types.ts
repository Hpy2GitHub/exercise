// types.ts - Complete type definitions

// Calculator types
export interface CalculatorLevel {
  reps: string;
  lbs: string;
  oneRepMax: string;
}

export interface Calculator {
  beginner: CalculatorLevel;
  intermediate: CalculatorLevel;
  advanced: CalculatorLevel;
}

// Core Exercise type (used throughout the app)
export interface Exercise {
  name: string;
  key: string;
  thumbnailLink?: string;
  videoLink?: string;
  hasVideo?: boolean;
  description?: string;
  primaryMuscle?: string;
  musclesTargeted?: string[];
  equipment?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions?: string[];
  commonMistakes?: string[];
  tips?: string[];
  calculator: Calculator;
}

// Alias for schemas.ts (keeps backward compatibility with Zod validation)
export type ExerciseData = Exercise;

// Exercise List types
export interface ExerciseList {
  name: string;
  description: string;
  exercises: string[]; // array of exercise keys
  createdDate: string;
  tags: string[];
}

// Export/Import data structure
export interface ExportData {
  exercises: Exercise[];
  lists: ExerciseList[];
}

// Muscle Diagram types (for highlighting in ExerciseDetail)
export interface MuscleRegion {
  x: number;
  y: number;
}

export interface MuscleDiagramGroup {
  name: string;
  regions: MuscleRegion[][];
}

export interface MuscleDiagramData {
  front: MuscleDiagramGroup[];
  back: MuscleDiagramGroup[];
}

// Muscle Table types (for ExerciseTable.tsx filtering)
export interface MuscleTableGroup {
  id: string;
  name: string;
  dataName: string;
  position: {
    left: string;
    top: string;
  };
}

export interface EquipmentType {
  id: string;
  name: string;
}
