// src/components/ExerciseListForm.tsx
import { ComponentType }  from 'react';
import { Save, X } from 'lucide-react';

// Define types (reuse from previous conversions where possible)
import {Exercise, ExerciseList }  from '../types';

interface ExerciseListFormProps {
  list: ExerciseList;
  exercises: Exercise[];
  onSave: () => void;
  onClose: () => void;
  onToggleExercise: (exerciseKey: string) => void;
  onListChange: (updatedList: ExerciseList) => void;
}

export const ExerciseListForm: React.FC<ExerciseListFormProps> = ({ 
  list, 
  exercises, 
  onSave, 
  onClose, 
  onToggleExercise, 
  onListChange 
}) => {
  const isEditing = list.createdDate && list.createdDate !== new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit List' : 'Create New List'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* List Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              List Name *
            </label>
            <input
              type="text"
              value={list.name}
              onChange={(e) => onListChange({ ...list, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Monday Upper Body, Full Body Workout, Leg Day"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={list.description}
              onChange={(e) => onListChange({ ...list, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe this workout list... (optional)"
            />
          </div>

          {/* Exercise Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Exercises
              <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                {list.exercises.length} selected
              </span>
            </label>
            
            <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-50">
              {exercises.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No exercises available</p>
                  <p className="text-sm text-gray-400">
                    Create some exercises first, then come back to build your list!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {exercises.map((exercise) => {
                    const isSelected = list.exercises.includes(exercise.key);
                    
                    return (
                      <label
                        key={exercise.key}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition ${
                          isSelected 
                            ? 'bg-indigo-50 border-2 border-indigo-300' 
                            : 'bg-white hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleExercise(exercise.key)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{exercise.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {exercise.primaryMuscle && (
                              <span className="text-xs text-gray-600">
                                {exercise.primaryMuscle}
                              </span>
                            )}
                            {exercise.difficulty && (
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {exercise.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            
            {exercises.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Tip: Select exercises in the order you want to perform them
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onSave}
              disabled={!list.name || list.exercises.length === 0}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
                !list.name || list.exercises.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Save size={20} />
              {isEditing ? 'Update List' : 'Create List'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
