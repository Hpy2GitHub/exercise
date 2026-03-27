// src/components/ExerciseForm.tsx
import { ComponentType } from 'react';
import { Save, X } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseFormProps {
  exercise: Exercise;
  onSave: () => void;
  onClose: () => void;
  editingIndex: number | null;
  keyWarning?: string;
  onNameChange: (value: string) => void;
  onNameBlur: () => void;
  onCheckboxChange: (field: keyof Exercise, value: string) => void;
  onArrayChange: (field: keyof Exercise, index: number, value: string) => void;
  onAddArrayItem: (field: keyof Exercise) => void;
  onRemoveArrayItem: (field: keyof Exercise, index: number) => void;
  onCalculatorChange: (level: 'beginner' | 'intermediate' | 'advanced', field: 'reps' | 'lbs' | 'oneRepMax', value: string) => void;
}

const MUSCLES: string[] = [
  'Abs', 'Adductors', 'Abductors', 'Back', 'Biceps', 'Calves', 'Chest', 'Forearms',
  'Feet', 'Glutes', 'Hamstrings', 'Lower Back', 'Neck', 'Obliques', 'Quads', 
  'Shoulders', 'Trapezius', 'Triceps',
];

const EQUIPMENT: string[] = [
  'Bands', 'Body Weight', 'Dumbbells', 'Foam Roller', 'Gym Machines', 'Kettlebells',
  'Other', 'Stability Ball', 'Stretch', 'TRX'
];

const DIFFICULTIES: string[] = ['Beginner', 'Intermediate', 'Advanced'];

export const ExerciseForm: React.FC<ExerciseFormProps> = ({
  exercise,
  onSave,
  onClose,
  editingIndex,
  keyWarning = '',
  onNameChange,
  onNameBlur,
  onCheckboxChange,
  onArrayChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onCalculatorChange,
}) => {
  const isEditing = editingIndex !== null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Exercise' : 'Add New Exercise'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Name & Key */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name *</label>
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => onNameChange(e.target.value)}
                onBlur={onNameBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Squat"
              />
              {keyWarning && <div className="text-amber-600 text-sm mt-1 font-medium">{keyWarning}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Key * (auto-generated)</label>
              <input
                type="text"
                value={exercise.key}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={exercise.difficulty || ''}
                onChange={(e) => onCheckboxChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Thumbnail (auto-generated)</label>
              <input type="text" value={exercise.thumbnailLink || ''} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Video Link (auto-generated)</label>
              <input type="text" value={exercise.videoLink || ''} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exercise.hasVideo || false}
                  onChange={(e) => onCheckboxChange('hasVideo', e.target.checked ? 'true' : 'false')}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Has Video Available</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">Check this if a video file exists for this exercise</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={exercise.description || ''}
              onChange={(e) => onCheckboxChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Primary Muscle (Radio Buttons) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Muscle Worked *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MUSCLES.map(muscle => (
                <label key={muscle} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="primaryMuscle"
                    checked={exercise.primaryMuscle === muscle}
                    onChange={() => onCheckboxChange('primaryMuscle', muscle)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{muscle}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Secondary Muscles Targeted (Checkboxes) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Muscles Targeted</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MUSCLES.map(muscle => (
                <label 
                  key={muscle} 
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(exercise.musclesTargeted || []).includes(muscle)}
                    onChange={() => onCheckboxChange('musclesTargeted', muscle)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{muscle}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {EQUIPMENT.map(equip => (
                <label key={equip} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(exercise.equipment || []).includes(equip)}
                    onChange={() => onCheckboxChange('equipment', equip)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{equip}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Instructions (ordered steps)</label>
              <button 
                onClick={() => onAddArrayItem('instructions')} 
                className="text-sm text-indigo-600 hover:text-indigo-700"
                type="button"
              >
                + Add Step
              </button>
            </div>
            {(exercise.instructions || []).map((step, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <span className="flex-shrink-0 w-8 h-10 flex items-center justify-center bg-gray-100 rounded text-sm font-medium text-gray-600">{i + 1}</span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => onArrayChange('instructions', i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {(exercise.instructions || []).length > 1 && (
                  <button 
                    onClick={() => onRemoveArrayItem('instructions', i)} 
                    className="text-red-600 hover:text-red-700"
                    type="button"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Common Mistakes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Common Mistakes</label>
              <button 
                onClick={() => onAddArrayItem('commonMistakes')} 
                className="text-sm text-indigo-600 hover:text-indigo-700"
                type="button"
              >
                + Add Mistake
              </button>
            </div>
            {(exercise.commonMistakes || []).map((mistake, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={mistake}
                  onChange={(e) => onArrayChange('commonMistakes', i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {(exercise.commonMistakes || []).length > 1 && (
                  <button 
                    onClick={() => onRemoveArrayItem('commonMistakes', i)} 
                    className="text-red-600 hover:text-red-700"
                    type="button"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tips */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Tips</label>
              <button 
                onClick={() => onAddArrayItem('tips')} 
                className="text-sm text-indigo-600 hover:text-indigo-700"
                type="button"
              >
                + Add Tip
              </button>
            </div>
            {(exercise.tips || []).map((tip, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tip}
                  onChange={(e) => onArrayChange('tips', i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {(exercise.tips || []).length > 1 && (
                  <button 
                    onClick={() => onRemoveArrayItem('tips', i)} 
                    className="text-red-600 hover:text-red-700"
                    type="button"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Performance Calculator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Calculator (Rep/Weight Guidelines)</label>
            <div className="space-y-4">
              {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                <div key={level} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3 capitalize">{level}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Reps</label>
                      <input
                        type="text"
                        value={exercise.calculator?.[level].reps || ''}
                        onChange={(e) => onCalculatorChange(level, 'reps', e.target.value)}
                        placeholder="e.g., 8-12"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Weight (lbs)</label>
                      <input
                        type="text"
                        value={exercise.calculator?.[level].lbs || ''}
                        onChange={(e) => onCalculatorChange(level, 'lbs', e.target.value)}
                        placeholder="e.g., 25"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">1RM (lbs)</label>
                      <input
                        type="text"
                        value={exercise.calculator?.[level].oneRepMax || ''}
                        onChange={(e) => onCalculatorChange(level, 'oneRepMax', e.target.value)}
                        placeholder="e.g., 100"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Save size={20} />
            {isEditing ? 'Update' : 'Add'} Exercise
          </button>
        </div>
      </div>
    </div>
  );
};
