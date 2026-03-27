// src/views/ExerciseListsView.tsx
import React from 'react';
import { Eye, Edit2, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { Exercise, ExerciseList } from '../types';  // Import from types
import { features } from "../config/features";

export interface ExerciseListsViewProps {
  lists: ExerciseList[];
  exercises: Exercise[];
  onView: (index: number) => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onCreate: () => void;
  onBack: () => void;
}

// ListCard component
const ListCard: React.FC<{ 
  list: ExerciseList;
  index: number;
  onView: (index: number) => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  exercises: Exercise[];
}> = ({ 
  list, 
  index, 
  onView, 
  onEdit, 
  onDelete, 
  exercises 
}) => {
  const listExercises = exercises.filter(ex => list.exercises.includes(ex.key));
  
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{list.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Created: {new Date(list.createdDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onView(index)} 
              className="text-indigo-600 hover:text-indigo-800"
              title="View List"
            >
              <Eye size={19} />
            </button>
            <button 
              onClick={() => onEdit(index)} 
              className="text-blue-600 hover:text-blue-800"
              title="Edit List"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => onDelete(index)} 
              className="text-red-600 hover:text-red-800"
              title="Delete List"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        {list.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{list.description}</p>
        )}
        
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Exercises:</span>
            <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
              {list.exercises.length}
            </span>
          </div>
          
          {listExercises.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {listExercises.slice(0, 3).map(ex => (
                <span key={ex.key} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {ex.name}
                </span>
              ))}
              {listExercises.length > 3 && (
                <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                  +{listExercises.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 border-t border-gray-200 px-5 py-3">
        <button
          onClick={() => onView(index)}
          className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center gap-1"
        >
          <Eye size={16} />
          View Full List
        </button>
      </div>
    </div>
  );
};

// Main component
export const ExerciseListsView: React.FC<ExerciseListsViewProps> = ({ 
  lists, 
  exercises, 
  onView, 
  onEdit, 
  onDelete, 
  onCreate, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">Exercise Lists</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your workout lists</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCreate}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
              >
                <Plus size={20} />
                New List
              </button>
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-5 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition font-medium"
              >
                <ArrowLeft size={20} />
                Back to Exercises
              </button>
            </div>
          </div>
          
          <div className="text-lg text-gray-700">
            Total Lists: <span className="font-bold text-indigo-600 text-2xl">{lists.length}</span>
          </div>
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Lists Yet</h3>
              <p className="text-gray-600 mb-6">Create your first exercise list to organize your workouts!</p>
              <button
                onClick={onCreate}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mx-auto"
              >
                <Plus size={20} />
                Create First List
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list, index) => (
              <ListCard
                key={index}
                list={list}
                index={index}
                exercises={exercises}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
