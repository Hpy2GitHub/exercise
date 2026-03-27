// src/views/ExerciseCardsView.tsx
import React, { useState } from 'react';
import { LayoutGrid, LayoutList, Filter, X, Search, ImageOff } from 'lucide-react';
import { ExerciseCard } from '../components/ExerciseCard';
import { EmptyState } from '../components/EmptyState';
import { Exercise, ExerciseList } from '../types';
import { getPublicUrl, getThumbnailUrl, getImageUrl } from '../utils/paths';
import {
  useExerciseFilter,
  MUSCLE_GROUPS,
  EQUIPMENT_TYPES,
} from '../hooks/useExerciseFilter';

// ─── Thumbnail tile ───────────────────────────────────────────────────────────

interface ThumbnailTileProps {
  exercise: Exercise;
  originalIndex: number;
  onView: (index: number) => void;
}

const ThumbnailTile: React.FC<ThumbnailTileProps> = ({ exercise, originalIndex, onView }) => {
  const [imgError, setImgError] = useState(false);

  const src = exercise.thumbnailLink
    ? exercise.thumbnailLink.includes('/')
      ? getPublicUrl(exercise.thumbnailLink)
      : getThumbnailUrl(exercise.thumbnailLink)
    : getThumbnailUrl(`${exercise.key}.jpg`);

  return (
    <button
      onClick={() => onView(originalIndex)}
      className="group flex flex-col bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        {!imgError ? (
          <img
            src={src}
            alt={exercise.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
            <ImageOff size={32} />
          </div>
        )}
      </div>
      <div className="px-2 py-2">
        <p className="text-xs font-semibold text-gray-800 text-center leading-tight line-clamp-2">
          {exercise.name}
        </p>
      </div>
    </button>
  );
};

// ─── Filter pill ──────────────────────────────────────────────────────────────

interface PillProps {
  label: string;
  active: boolean;
  color: 'purple' | 'indigo' | 'green';
  onClick: () => void;
}

const Pill: React.FC<PillProps> = ({ label, active, color, onClick }) => {
  const activeClass =
    color === 'purple' ? 'bg-purple-600 text-white shadow-md' :
    color === 'green'  ? 'bg-green-600 text-white shadow-md' :
                         'bg-indigo-600 text-white shadow-md';
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
        active ? activeClass : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400'
      }`}
    >
      {label}
    </button>
  );
};

// ─── Main view ────────────────────────────────────────────────────────────────

interface ExerciseCardsViewProps {
  exercises: Exercise[];
  lists: ExerciseList[];
  isFormOpen: boolean;
  onView: (index: number) => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onAddExercise: () => void;
}

type DisplayMode = 'cards' | 'gallery';

export const ExerciseCardsView: React.FC<ExerciseCardsViewProps> = ({
  exercises,
  lists,
  isFormOpen,
  onView,
  onEdit,
  onDelete,
  onAddExercise,
}) => {
  const safeExercises = Array.isArray(exercises) ? exercises : [];
  const [displayMode, setDisplayMode] = useState<DisplayMode>('cards');
  const [showFilters, setShowFilters] = useState(false);

  const {
    filterState,
    hasActiveFilters,
    setSearchQuery,
    togglePrimaryMuscle,
    toggleMuscle,
    toggleEquipment,
    clearAllFilters,
    filteredExercises,
  } = useExerciseFilter(safeExercises);

  const { searchQuery, primaryMuscle, selectedMuscles, selectedEquipment } = filterState;

  const activeFilterGroupCount = [
    !!primaryMuscle,
    selectedMuscles.length > 0,
    selectedEquipment.length > 0,
  ].filter(Boolean).length;

  if (safeExercises.length === 0 && !isFormOpen) {
    return <EmptyState onAddExercise={onAddExercise} />;
  }

  return (
    <div className="mt-6">
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search exercises…"
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            showFilters || hasActiveFilters
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
          }`}
        >
          <Filter size={16} />
          Filters
          {activeFilterGroupCount > 0 && (
            <span className="bg-white text-indigo-700 rounded-full px-1.5 py-0.5 text-xs font-bold leading-none">
              {activeFilterGroupCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="text-sm text-red-500 hover:text-red-700 underline">
            Clear all
          </button>
        )}

        {/* Result count */}
        <span className="text-sm text-gray-500 ml-auto mr-2">
          {filteredExercises.length} / {safeExercises.length} exercises
        </span>

        {/* View mode toggle */}
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            onClick={() => setDisplayMode('cards')}
            title="Card view"
            className={`p-2 transition ${displayMode === 'cards' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutList size={18} />
          </button>
          <button
            onClick={() => setDisplayMode('gallery')}
            title="Gallery view"
            className={`p-2 transition ${displayMode === 'gallery' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* ── Filter panel ─────────────────────────────────────────────────────── */}
      {showFilters && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
          <div className="mb-6 flex justify-center">
            <img
              src={getImageUrl('nav/muscles.png')}
              alt="Muscle groups reference"
              className="max-w-full h-auto rounded-lg shadow-sm max-h-48 object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Primary Muscle</h3>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map(m => (
                  <Pill
                    key={m.id}
                    label={m.name}
                    active={primaryMuscle === m.id}
                    color="purple"
                    onClick={() => togglePrimaryMuscle(m.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Secondary Muscles</h3>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map(m => (
                  <Pill
                    key={m.id}
                    label={m.name}
                    active={selectedMuscles.includes(m.id)}
                    color="indigo"
                    onClick={() => toggleMuscle(m.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Equipment</h3>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT_TYPES.map(eq => (
                  <Pill
                    key={eq.id}
                    label={eq.name}
                    active={selectedEquipment.includes(eq.id)}
                    color="green"
                    onClick={() => toggleEquipment(eq.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── No results ───────────────────────────────────────────────────────── */}
      {filteredExercises.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          {hasActiveFilters ? 'No exercises match the current filters.' : 'No exercises available yet.'}
        </div>
      )}

      {/* ── Gallery view ─────────────────────────────────────────────────────── */}
      {displayMode === 'gallery' && filteredExercises.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {filteredExercises.map(exercise => {
            const originalIndex = safeExercises.findIndex(ex => ex.key === exercise.key);
            return (
              <ThumbnailTile
                key={exercise.key}
                exercise={exercise}
                originalIndex={originalIndex}
                onView={onView}
              />
            );
          })}
        </div>
      )}

      {/* ── Cards view ───────────────────────────────────────────────────────── */}
      {displayMode === 'cards' && filteredExercises.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExercises.map(exercise => {
            const originalIndex = safeExercises.findIndex(ex => ex.key === exercise.key);
            return (
              <ExerciseCard
                key={exercise.key || originalIndex}
                exercise={exercise}
                lists={lists}
                index={originalIndex}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
