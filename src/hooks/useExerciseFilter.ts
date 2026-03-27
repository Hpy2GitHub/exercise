// src/hooks/useExerciseFilter.ts
import { useState, useMemo } from 'react';
import { Exercise } from '../types';

// ─── Master lists ─────────────────────────────────────────────────────────────
// Keep these in sync with the MUSCLES / EQUIPMENT constants in ExerciseForm.tsx.
// The `dataName` must exactly match the string values stored on Exercise objects.

export const MUSCLE_GROUPS: { id: string; name: string; dataName: string }[] = [
  { id: 'abs',         name: 'Abs',         dataName: 'Abs' },
  { id: 'abductors',   name: 'Abductors',   dataName: 'Abductors' },
  { id: 'adductors',   name: 'Adductors',   dataName: 'Adductors' },
  { id: 'back',        name: 'Back',        dataName: 'Back' },
  { id: 'biceps',      name: 'Biceps',      dataName: 'Biceps' },
  { id: 'calves',      name: 'Calves',      dataName: 'Calves' },
  { id: 'chest',       name: 'Chest',       dataName: 'Chest' },
  { id: 'feet',        name: 'Feet',        dataName: 'Feet' },
  { id: 'forearms',    name: 'Forearms',    dataName: 'Forearms' },
  { id: 'glutes',      name: 'Glutes',      dataName: 'Glutes' },
  { id: 'hamstrings',  name: 'Hamstrings',  dataName: 'Hamstrings' },
  { id: 'lowerback',   name: 'Lower Back',  dataName: 'Lower Back' },
  { id: 'neck',        name: 'Neck',        dataName: 'Neck' },
  { id: 'obliques',    name: 'Obliques',    dataName: 'Obliques' },
  { id: 'quads',       name: 'Quads',       dataName: 'Quads' },
  { id: 'shoulders',   name: 'Shoulders',   dataName: 'Shoulders' },
  { id: 'traps',       name: 'Trapezius',   dataName: 'Trapezius' },
  { id: 'triceps',     name: 'Triceps',     dataName: 'Triceps' },
];

export const EQUIPMENT_TYPES: { id: string; name: string }[] = [
  { id: 'band',       name: 'Bands' },
  { id: 'bodyweight', name: 'Body Weight' },
  { id: 'dumbbell',   name: 'Dumbbells' },
  { id: 'foam',       name: 'Foam Roller' },
  { id: 'machine',    name: 'Gym Machines' },
  { id: 'kettle',     name: 'Kettlebells' },
  { id: 'other',      name: 'Other' },
  { id: 'ball',       name: 'Stability Ball' },
  { id: 'stretch',    name: 'Stretch' },
  { id: 'trx',        name: 'TRX' },
];

// ─── Muscle name normalisation ────────────────────────────────────────────────
// Handles case differences and the foot/feet irregular plural.

const normalize = (s: string) => s.toLowerCase().trim();
const FOOT_FEET = new Set(['foot', 'feet']);

export const muscleMatches = (a: string, b: string): boolean => {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return true;
  if (FOOT_FEET.has(na) && FOOT_FEET.has(nb)) return true;
  return false;
};

// ─── Filter state & logic ─────────────────────────────────────────────────────

export interface ExerciseFilterState {
  searchQuery: string;
  primaryMuscle: string;       // single muscle id, '' = none
  selectedMuscles: string[];   // secondary muscle ids
  selectedEquipment: string[]; // equipment ids
}

export interface UseExerciseFilterReturn {
  // State
  filterState: ExerciseFilterState;
  hasActiveFilters: boolean;

  // Setters
  setSearchQuery: (q: string) => void;
  setPrimaryMuscle: (id: string) => void;   // set '' to clear
  togglePrimaryMuscle: (id: string) => void; // toggles on/off (useful for pill buttons)
  toggleMuscle: (id: string) => void;
  toggleEquipment: (id: string) => void;
  clearAllFilters: () => void;

  // Derived data
  filteredExercises: Exercise[];
}

export function useExerciseFilter(exercises: Exercise[]): UseExerciseFilterReturn {
  const [searchQuery, setSearchQuery]   = useState('');
  const [primaryMuscle, setPrimaryMuscle] = useState('');
  const [selectedMuscles, setSelectedMuscles]     = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  const togglePrimaryMuscle = (id: string) =>
    setPrimaryMuscle(prev => (prev === id ? '' : id));

  const toggleMuscle = (id: string) =>
    setSelectedMuscles(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const toggleEquipment = (id: string) =>
    setSelectedEquipment(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const clearAllFilters = () => {
    setSearchQuery('');
    setPrimaryMuscle('');
    setSelectedMuscles([]);
    setSelectedEquipment([]);
  };

  const hasActiveFilters =
    !!searchQuery.trim() ||
    !!primaryMuscle ||
    selectedMuscles.length > 0 ||
    selectedEquipment.length > 0;

  const filteredExercises = useMemo(() => {
    let result = [...exercises];

    // Name / key search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        ex => ex.name.toLowerCase().includes(q) || ex.key?.toLowerCase().includes(q)
      );
    }

    // Primary muscle (single)
    if (primaryMuscle) {
      const pName = MUSCLE_GROUPS.find(m => m.id === primaryMuscle)?.dataName;
      if (pName) {
        result = result.filter(ex =>
          ex.primaryMuscle ? muscleMatches(ex.primaryMuscle, pName) : false
        );
      }
    }

    // Secondary muscles (any-of)
    if (selectedMuscles.length > 0) {
      const names = selectedMuscles
        .map(id => MUSCLE_GROUPS.find(m => m.id === id)?.dataName)
        .filter(Boolean) as string[];
      result = result.filter(ex =>
        ex.musclesTargeted?.some(m => names.some(n => muscleMatches(m, n)))
      );
    }

    // Equipment (any-of)
    if (selectedEquipment.length > 0) {
      const names = selectedEquipment
        .map(id => EQUIPMENT_TYPES.find(e => e.id === id)?.name)
        .filter(Boolean) as string[];
      result = result.filter(ex =>
        ex.equipment?.some(eq => names.includes(eq))
      );
    }

    return result;
  }, [exercises, searchQuery, primaryMuscle, selectedMuscles, selectedEquipment]);

  return {
    filterState: { searchQuery, primaryMuscle, selectedMuscles, selectedEquipment },
    hasActiveFilters,
    setSearchQuery,
    setPrimaryMuscle,
    togglePrimaryMuscle,
    toggleMuscle,
    toggleEquipment,
    clearAllFilters,
    filteredExercises,
  };
}
