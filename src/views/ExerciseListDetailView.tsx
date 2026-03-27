// src/views/ExerciseListDetailView.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Dumbbell, 
  LayoutGrid, 
  LayoutList, 
  Eye, 
  Edit2, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { ExerciseCard } from '../components/ExerciseCard';
import { PrintButton } from '../components/PrintButton';
import { Exercise, ExerciseList } from '../types';
import { features } from "../config/features";

interface ExerciseListDetailViewProps {
  list: ExerciseList | null;
  exercises: Exercise[];
  onBack: () => void;
  onEdit: () => void;
  onRemoveExercise: (exerciseKey: string) => void;
}

export const ExerciseListDetailView: React.FC<ExerciseListDetailViewProps> = ({ 
  list, 
  exercises, 
  onBack, 
  onEdit,
  onRemoveExercise,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  
  // Create a ref for the print portal container
  const printPortalRef = useRef<HTMLDivElement | null>(null);

  // Memoize the filtered exercises
  const listExercises = React.useMemo(() => {
    if (!list) return [];
    return exercises.filter(ex => list.exercises.includes(ex.key));
  }, [list, exercises]);

  // Set up and clean up the print portal container
  useEffect(() => {
    // Create the container element
    const container = document.createElement('div');
    container.id = 'print-portal-container';
    document.body.appendChild(container);
    printPortalRef.current = container;

    // Cleanup function - remove the container when component unmounts
    return () => {
      if (printPortalRef.current && document.body.contains(printPortalRef.current)) {
        document.body.removeChild(printPortalRef.current);
      }
      printPortalRef.current = null;
    };
  }, []); // Empty dependency array - run once on mount/unmount

  const handleCardView = useCallback((index: number) => {
    // Bounds check
    if (index < 0 || index >= listExercises.length) {
      console.error(`Invalid index: ${index} for listExercises (length: ${listExercises.length})`);
      return;
    }
    
    console.log('View exercise:', listExercises[index].name);
    alert(`View exercise: ${listExercises[index].name}\n\nIn a real implementation, this would open the exercise detail view.`);
  }, [listExercises]);

  const handleCardEdit = useCallback((index: number) => {
    // Bounds check
    if (index < 0 || index >= listExercises.length) {
      console.error(`Invalid index: ${index} for listExercises (length: ${listExercises.length})`);
      return;
    }
    
    console.log('Edit exercise:', listExercises[index].name);
    alert(`Edit exercise: ${listExercises[index].name}\n\nIn a real implementation, this would open the exercise edit form.`);
  }, [listExercises]);

  const handleCardDelete = useCallback((index: number) => {
    // Bounds check
    if (index < 0 || index >= listExercises.length) {
      console.error(`Invalid index: ${index} for listExercises (length: ${listExercises.length})`);
      return;
    }
    
    const exercise = listExercises[index];
    const isConfirmed = window.confirm(
      `Remove "${exercise.name}" from this list?\n\nThis will only remove it from the current list, not delete the exercise entirely.`
    );
    
    if (isConfirmed) {
      setRemovingIndex(index);
      onRemoveExercise(exercise.key);
      setTimeout(() => setRemovingIndex(null), 300);
    }
  }, [listExercises, onRemoveExercise]);

  const renderPrintContent = () => {
    // Only render portal if the container exists
    if (!printPortalRef.current) {
      return null;
    }

    return ReactDOM.createPortal(
      <div className="print-only">
        <div className="print-exercises">
          {listExercises.map((exercise, idx) => {
            const thumbnailPath = exercise.thumbnailLink || `/images/thumbnails/${exercise.key}.jpg`;

            return (
              <div key={exercise.key} className="print-exercise-item">
                {/* Number and Name Header */}
                <div className="print-exercise-header">
                  <span className="print-exercise-number">{idx + 1}.</span>
                  <span className="print-exercise-name">{exercise.name}</span>
                </div>

                {/* Thumbnail Only */}
                <div className="print-exercise-photo">
                  <img
                    src={thumbnailPath}
                    alt={exercise.name}
                    className="print-thumbnail"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.innerHTML = '<div class="print-no-image">No image</div>';
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>,
      printPortalRef.current // Render to our managed container
    );
  };

  if (!list) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">List Not Found</h2>
          <p className="text-gray-600 mb-6">The requested exercise list could not be found.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Back to Lists
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {renderPrintContent()}
      
      {/* NORMAL SCREEN VIEW */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{list.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar size={16} />
                  <span>Created: {new Date(list.createdDate).toLocaleDateString()}</span>
                </div>
                
                {/* Print Button */}
                <div className="flex items-center gap-3 mt-4">
                  <PrintButton />
                  <span className="text-xs text-gray-500">
                    Click to generate a printable workout sheet
                  </span>
                </div>
                
                {list.description && (
                  <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500 mt-6">
                    <p className="text-gray-700 leading-relaxed">{list.description}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={onEdit}
                  className="px-5 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium whitespace-nowrap"
                  aria-label={`Edit list "${list.name}"`}
                >
                  Edit List
                </button>
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2 font-medium"
                  aria-label="Back to exercise lists"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Dumbbell className="text-indigo-600" size={28} />
                Exercises in this List
                <span className="text-lg font-normal text-gray-600">
                  ({listExercises.length} exercise{listExercises.length !== 1 ? 's' : ''})
                </span>
              </h2>
              
              {/* View Toggle */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:block">View:</span>
                <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                      viewMode === 'list' 
                        ? 'bg-white shadow text-indigo-600' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    aria-label="Switch to list view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <LayoutList size={18} />
                    <span className="hidden sm:inline">List</span>
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                      viewMode === 'cards' 
                        ? 'bg-white shadow text-indigo-600' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    aria-label="Switch to card view"
                    aria-pressed={viewMode === 'cards'}
                  >
                    <LayoutGrid size={18} />
                    <span className="hidden sm:inline">Cards</span>
                  </button>
                </div>
              </div>
            </div>
            
            {listExercises.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Exercises Yet</h3>
                  <p className="text-gray-600 mb-6">This list doesn't contain any exercises yet.</p>
                  <button
                    onClick={onEdit}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Edit List to Add Exercises
                  </button>
                </div>
              </div>
            ) : viewMode === 'list' ? (
              // LIST VIEW
              <div className="space-y-4">
                {listExercises.map((exercise, idx) => (
                  <div 
                    key={exercise.key} 
                    className={`border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition ${
                      removingIndex === idx ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{exercise.name}</h3>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {exercise.difficulty}
                          </span>
                          
                          {exercise.primaryMuscle && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              Primary: {exercise.primaryMuscle}
                            </span>
                          )}
                          
                          {exercise.equipment && exercise.equipment.length > 0 && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {exercise.equipment.join(', ')}
                            </span>
                          )}
                        </div>
                        
                        {exercise.description && (
                          <p className="text-sm text-gray-600 leading-relaxed mb-3">
                            {exercise.description}
                          </p>
                        )}
                        
                        {exercise.musclesTargeted && exercise.musclesTargeted.length > 0 && (
                          <div className="mt-3">
                            <span className="text-xs font-semibold text-gray-600 mr-2">Secondary Muscles:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {exercise.musclesTargeted.map(muscle => (
                                <span 
                                  key={muscle} 
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                >
                                  {muscle}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleCardView(idx)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition"
                            aria-label={`View details of ${exercise.name}`}
                          >
                            <Eye size={14} />
                            View Details
                          </button>
                          <button
                            onClick={() => handleCardEdit(idx)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                            aria-label={`Edit ${exercise.name}`}
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleCardDelete(idx)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition"
                            aria-label={`Remove ${exercise.name} from list`}
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // CARD VIEW (Using the shared ExerciseCard component)
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listExercises.map((exercise, idx) => (
                  <ExerciseCard
                    key={exercise.key}
                    exercise={exercise}
                    index={idx}
                    lists={[]}
                    onView={() => handleCardView(idx)}
                    onEdit={() => handleCardEdit(idx)}
                    onDelete={() => handleCardDelete(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExerciseListDetailView;
