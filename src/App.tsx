// src/App.tsx 
import React, { useState, useEffect, useRef } from 'react';
import { useExercises } from './hooks/useExercises';
import { Header } from './components/Header';
import { ExerciseCardsView } from './views/ExerciseCardsView';
import { ExerciseTableView } from './views/ExerciseTableView';
import { ExerciseDetailView } from './views/ExerciseDetailView';
import { ExerciseForm } from './components/ExerciseForm';
import { ExerciseListsView } from './views/ExerciseListsView';
import { ExerciseListDetailView } from './views/ExerciseListDetailView';
import { ExerciseListForm } from './components/ExerciseListForm';
import { MuscleDiagramData } from './types';
import { getPublicUrl } from './utils/paths';
import { DefaultDataBanner } from './components/DefaultDataBanner'; 

export const App: React.FC = () => {
  const {
    exercises,
    lists,
    viewMode,
    setViewMode,
    isUsingDefaults,     // NEW
    resetToDefaults,     // NEW
    selectedExerciseIndex,
    selectedListIndex,
    isFormOpen,
    setIsFormOpen,
    isListFormOpen,
    setIsListFormOpen,
    currentExercise,
    currentList,
    setCurrentList,
    editingIndex,
    keyWarning,
    launchTime,

    handleViewDetails,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleExport,
    handleImport,
    openAddForm,

    handleNameChange,
    handleNameBlur,
    handleCheckboxChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
    handleCalculatorChange,

    // List handlers
    handleListCreate,
    handleListUpdate,
    handleListDelete,
    handleListView,
    handleListSubmit,
    toggleExerciseInList,
    handleToggleExerciseInList, // ADD THIS - it's exported from useExercises
  } = useExercises();

  // Add muscle diagram data state
  const [muscleDiagramData, setMuscleDiagramData] = useState<MuscleDiagramData | null>(null);
  const muscleDiagramDataRef = useRef<MuscleDiagramData | null>(null);
  const loadMuscleDiagramData = async () => {
    try {
      console.log('Attempting to load muscle diagram data...');
  
      const url = getPublicUrl('muscle-diagram-data.json');
      console.log('Fetching muscle diagram from:', url);
  
      const response = await fetch(url);
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        console.log('Real file not found, trying sample...');
        const sampleResponse = await fetch('/sample_muscle-diagram-data.json');
  
        if (!sampleResponse.ok) {
          throw new Error(`Both files not found: ${response.status}, ${sampleResponse.status}`);
        }
  
        const data = await sampleResponse.json();
        console.log('Loaded sample data instead');
        setMuscleDiagramData(data);
        muscleDiagramDataRef.current = data;
        return;
      }
  
      const data = await response.json();
      console.log('Real muscle diagram data loaded successfully!');
      setMuscleDiagramData(data);
      muscleDiagramDataRef.current = data;
    } catch (error) {
      console.error('Error loading muscle diagram data:', error);
      setMuscleDiagramData(null);
    }
  };


  // Load muscle diagram data
  const oldloadMuscleDiagramData = async () => {
    try {
      console.log('Attempting to load muscle diagram data...');
      const response = await fetch(getPublicUrl('muscle-diagram-data.json'));
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.log('Real file not found, trying sample...');
        const sampleResponse = await fetch('/sample_muscle-diagram-data.json');
        if (!sampleResponse.ok) {
          throw new Error(`Both files not found: ${response.status}, ${sampleResponse.status}`);
        }
        const data = await sampleResponse.json();
        console.log('Loaded sample data instead');
        setMuscleDiagramData(data);
        muscleDiagramDataRef.current = data;
        return;
      }
      
      const data = await response.json();
      console.log('Real muscle diagram data loaded successfully!');
      setMuscleDiagramData(data);
      muscleDiagramDataRef.current = data;
    } catch (error) {
      console.error('Error loading muscle diagram data:', error);
      setMuscleDiagramData(null);
    }
  };

  useEffect(() => {
    loadMuscleDiagramData();
    
    const timeout = setTimeout(() => {
      if (!muscleDiagramDataRef.current) {
        console.log('No muscle diagram data loaded - using static images only');
      }
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, []);

  // ExerciseList Detail View
  if (viewMode === 'listDetail' && selectedListIndex !== null) {
    console.log("App.tsx 147 ExerciseList Detail View");
    return (
      <ExerciseListDetailView
        list={lists[selectedListIndex]}
        exercises={exercises}
        onBack={() => setViewMode('cards')}
        onEdit={() => handleListUpdate(selectedListIndex)}
        onRemoveExercise={(exerciseKey) => handleToggleExerciseInList(selectedListIndex, exerciseKey)}
      />
    );
  }

  // ExerciseLists View (showing all lists)
  if (viewMode === 'lists') {
    return (
      <>
        <ExerciseListsView
          lists={lists}
          exercises={exercises}
          onView={handleListView}
          onEdit={handleListUpdate}
          onDelete={handleListDelete}
          onCreate={handleListCreate}
          onBack={() => setViewMode('cards')}
        />
        
        {isListFormOpen && (
          <ExerciseListForm
            list={currentList}
            exercises={exercises}
            onSave={handleListSubmit}
            onClose={() => setIsListFormOpen(false)}
            onToggleExercise={toggleExerciseInList}
            onListChange={setCurrentList}
          />
        )}
      </>
    );
  }

  // Exercise Table View
  if (viewMode === 'table') {
    return (
      <>
        <ExerciseTableView
          exercises={exercises}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
          onBack={() => setViewMode('cards')}
          onAddExercise={openAddForm}
        />
        
        {isFormOpen && (
          <ExerciseForm
            exercise={currentExercise}
            editingIndex={editingIndex}
            keyWarning={keyWarning}
            onNameChange={handleNameChange}
            onNameBlur={handleNameBlur}
            onCheckboxChange={handleCheckboxChange}
            onArrayChange={handleArrayChange}
            onAddArrayItem={addArrayItem}
            onRemoveArrayItem={removeArrayItem}
            onCalculatorChange={handleCalculatorChange}
            onSave={handleSubmit}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </>
    );
  }

  // Exercise Detail View (single exercise details)
  if (viewMode === 'detail' && selectedExerciseIndex !== null) {
    // Bounds check - ensure index is valid
    if (selectedExerciseIndex < 0 || selectedExerciseIndex >= exercises.length) {
      console.error(
        `Invalid exercise index: ${selectedExerciseIndex} (valid range: 0-${exercises.length - 1}). Returning to cards view.`
      );
      // Automatically return to cards view if index is out of bounds
      setViewMode('cards');
      return null; // Prevent rendering with invalid data
    }
    return (
      <>
        <ExerciseDetailView
          exercise={exercises[selectedExerciseIndex]}
          lists={lists}
          onBack={() => setViewMode('cards')}
          onEdit={() => handleEdit(selectedExerciseIndex)}
          onToggleList={handleToggleExerciseInList} // ADD THIS
          muscleDiagramData={muscleDiagramData ?? undefined}
        />
        
        {isFormOpen && (
          <ExerciseForm
            exercise={currentExercise}
            editingIndex={editingIndex}
            keyWarning={keyWarning}
            onNameChange={handleNameChange}
            onNameBlur={handleNameBlur}
            onCheckboxChange={handleCheckboxChange}
            onArrayChange={handleArrayChange}
            onAddArrayItem={addArrayItem}
            onRemoveArrayItem={removeArrayItem}
            onCalculatorChange={handleCalculatorChange}
            onSave={handleSubmit}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </>
    );
  }

  // Exercise Cards View (default/main view)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header
          exerciseCount={exercises.length}
          launchTime={launchTime}
          onTableView={() => setViewMode('table')}
          onListsView={() => setViewMode('lists')}
          onImport={handleImport}
          onExport={handleExport}
          onAddNew={openAddForm}
        />

        {/* NEW: Show banner when using default data (after <Header ...) */}
        {isUsingDefaults && (
          <DefaultDataBanner
            isVisible={true}
            onReset={resetToDefaults}
            onExport={handleExport}
          />
        )}

        <ExerciseCardsView
          exercises={exercises}
          lists={lists}
          isFormOpen={isFormOpen}
          onView={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddExercise={openAddForm}
        />

        {isFormOpen && (
          <ExerciseForm
            exercise={currentExercise}
            editingIndex={editingIndex}
            keyWarning={keyWarning}
            onNameChange={handleNameChange}
            onNameBlur={handleNameBlur}
            onCheckboxChange={handleCheckboxChange}
            onArrayChange={handleArrayChange}
            onAddArrayItem={addArrayItem}
            onRemoveArrayItem={removeArrayItem}
            onCalculatorChange={handleCalculatorChange}
            onSave={handleSubmit}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

// Add default export
export default App;
