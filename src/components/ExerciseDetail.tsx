// src/components/ExerciseDetail.tsx
import { useMemo, useState } from 'react';
import { ArrowLeft, Dumbbell, Target, AlertCircle, Lightbulb, TrendingUp, RefreshCw } from 'lucide-react';
import { Exercise, ExerciseList } from '../types';
import { MuscleDiagramData } from '../types';
import { getThumbnailUrl, getVideoUrl, getImageUrl, getPublicUrl } from '../utils/paths';


interface ImageSize {
  width: number;
  height: number;
}

interface SvgPoint {
  x: number;
  y: number;
  color: string;
  muscle: string;
}

interface GenerateMuscleSVGResult {
  front: SvgPoint[];
  back: SvgPoint[];
}

interface ExerciseDetailProps {
  exercise: Exercise | null;
  lists?: ExerciseList[];
  onBack: () => void;
  onEdit: () => void;
  onToggleList?: (listIndex: number, exerciseKey: string) => void;
  muscleDiagramData: MuscleDiagramData | null;
}

// Helper function to handle various naming conventions with better plural/singular handling
const normalizeMuscleName = (name: string): string[] => {
  if (!name) return [];
  
  const normalized = name.toLowerCase().trim();
  
  const variations = [
    normalized,
    normalized.replace(/\s+/g, '_'),
    normalized.replace(/\s+/g, '-'),
  ];
  
  if (normalized === 'feet') {
    variations.push('foot');
  } else if (normalized === 'foot') {
    variations.push('feet');
  } else if (normalized.endsWith('s') && normalized.length > 1) {
    const singular = normalized.slice(0, -1);
    variations.push(singular);
    variations.push(singular.replace(/\s+/g, '_'));
    variations.push(singular.replace(/\s+/g, '-'));
  }
  
  if (normalized.includes('back')) {
    variations.push('back');
    variations.push('lowerback');
    variations.push('lower_back');
    variations.push('lower-back');
  }
  
  return Array.from(new Set(variations.map(v => v.toLowerCase())));
};

export const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ 
  exercise, 
  lists = [],
  onBack, 
  onEdit,
  onToggleList,
  muscleDiagramData 
}) => {
  const [frontImageLoaded, setFrontImageLoaded] = useState<boolean>(false);
  const [backImageLoaded, setBackImageLoaded] = useState<boolean>(false);
  const [frontImageSize, setFrontImageSize] = useState<ImageSize>({ width: 300, height: 400 });
  const [backImageSize, setBackImageSize] = useState<ImageSize>({ width: 300, height: 400 });
  
  const generateMuscleSVG = useMemo((): GenerateMuscleSVGResult => {
    if (!exercise || !muscleDiagramData) {
      return { front: [], back: [] };
    }

    const primaryMuscleVariations = normalizeMuscleName(exercise.primaryMuscle || '');
    const secondaryMuscleVariations = exercise.musclesTargeted?.flatMap(m => normalizeMuscleName(m)) || [];
    
    const generateForView = (view: keyof MuscleDiagramData): SvgPoint[] => {
      const muscles = muscleDiagramData[view] || [];
      const svgElements: SvgPoint[] = [];
      
      muscles.forEach(muscleGroup => {
        const muscleName = muscleGroup.name.toLowerCase().trim();
        let color: string | null = null;
        
        const isPrimary = primaryMuscleVariations.some(variation => muscleName === variation);
        const isSecondary = secondaryMuscleVariations.some(variation => muscleName === variation);
        
        if (isPrimary) {
          color = '#c14249';
        } else if (isSecondary) {
          color = '#41c249';
        }
        
        if (color) {
          muscleGroup.regions.forEach((region) => {
            region.forEach((point) => {
              svgElements.push({
                x: point.x,
                y: point.y,
                color: color!,
                muscle: muscleName
              });
            });
          });
        }
      });

      return svgElements;
    };

    return {
      front: generateForView('front'),
      back: generateForView('back')
    };
  }, [exercise, muscleDiagramData]);

  const handleImageLoad = (view: 'front' | 'back', event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.target as HTMLImageElement;
    
    if (view === 'front') {
      setFrontImageLoaded(true);
      setFrontImageSize({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    } else {
      setBackImageLoaded(true);
      setBackImageSize({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    }
  };

  const determineViewsToShow = () => {
    if (!exercise) {
      return { showFront: true, showBack: true };
    }

    const primaryMuscle = exercise.primaryMuscle?.toLowerCase();
    const secondaryMuscles = exercise.musclesTargeted?.map(m => m.toLowerCase()) || [];
    
    const frontMuscles = [ 'abs', 'abductors', 'adductors', 'biceps', 'calves', 'chest', 'forearms',
       'feet', 'foot', 'neck', 'obliques', 'quads'];

    const backMuscles = [ 'abductors', 'adductors', 'back', 'calves', 'forearms', 'feet', 'foot', 'glutes', 
       'hamstrings', 'lowerback', 'lower back', 'lower-back', 'lower_back', 'neck', 'obliques', 'shoulders', 'trapezius', 'triceps'];
    
    let showFront = false;
    let showBack = false;
    
    if (primaryMuscle) {
      if (frontMuscles.some(m => primaryMuscle.includes(m) || m.includes(primaryMuscle))) {
        showFront = true;
      }
      if (backMuscles.some(m => primaryMuscle.includes(m) || m.includes(primaryMuscle))) {
        showBack = true;
      }
    }
    
    secondaryMuscles.forEach(muscle => {
      if (frontMuscles.some(m => muscle.includes(m) || m.includes(muscle))) {
        showFront = true;
      }
      if (backMuscles.some(m => muscle.includes(m) || m.includes(muscle))) {
        showBack = true;
      }
    });
    
    if (!showFront && !showBack) {
      showFront = true;
      showBack = true;
    }
    
    return { showFront, showBack };
  };

  const { showFront, showBack } = determineViewsToShow();

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <p className="text-gray-500 text-lg">No exercise selected</p>
      </div>
    );
  }

  const videoUrl = exercise.videoLink ? getVideoUrl(exercise.videoLink) : null;
  const posterUrl = exercise.thumbnailLink 
    ? (exercise.thumbnailLink.includes('/') 
        ? getPublicUrl(exercise.thumbnailLink)
        : getThumbnailUrl(exercise.thumbnailLink))
    : undefined;
  const fallbackImageUrl = exercise.thumbnailLink
    ? (exercise.thumbnailLink.includes('/')
        ? getPublicUrl(exercise.thumbnailLink)
        : getThumbnailUrl(exercise.thumbnailLink))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{exercise.name}</h1>
              <p className="text-sm text-gray-500 mb-4">Key: {exercise.key}</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                  {exercise.difficulty || 'N/A'}
                </span>
                {exercise.primaryMuscle && (
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-bold flex items-center gap-2">
                    <Target size={16} />
                    Primary: {exercise.primaryMuscle}
                  </span>
                )}
                {exercise.equipment && exercise.equipment.length > 0 && (
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Dumbbell size={16} />
                    {exercise.equipment.join(', ')}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-5 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
                >
                  Edit
                </button>
              )}
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              )}
            </div>
          </div>

          {exercise.description && (
            <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed text-lg">{exercise.description}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Exercise Demo & Target Muscles
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                Play Exercise Demo
              </h3>
              {exercise.hasVideo !== false && videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  poster={posterUrl}
                  className="w-full rounded-xl shadow-2xl"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              ) : fallbackImageUrl ? (
                <img src={fallbackImageUrl} alt={exercise.name} className="w-full rounded-xl shadow-2xl" />
              ) : (
                <div className="aspect-video bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">No video available</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                Target Muscles
                {(!frontImageLoaded || !backImageLoaded) && (
                  <RefreshCw size={16} className="animate-spin text-gray-400" />
                )}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {showFront && (
                  <div> 
                    <div className="relative w-full aspect-square bg-gray-100 rounded-xl shadow-lg border border-gray-300 overflow-hidden">
                      <img
                        src={getImageUrl('muscles/front.png')}
                        alt="Front muscle diagram"
                        className="absolute inset-0 w-full h-full object-contain"
                        onLoad={(e) => handleImageLoad('front', e)}
                        onError={() => console.error('Failed to load front image')}
                      />
                      
                      {generateMuscleSVG.front && generateMuscleSVG.front.length > 0 && (
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox={`0 0 ${frontImageSize.width} ${frontImageSize.height}`}
                          preserveAspectRatio="xMidYMid meet"
                        >
                          {generateMuscleSVG.front.map((point, idx) => (
                            <circle
                              key={`front-${idx}`}
                              cx={point.x}
                              cy={point.y}
                              r="1"
                              fill={point.color}
                              opacity="0.7"
                            />
                          ))}
                        </svg>
                      )}
                    </div>
                    <h4 className="text-md font-medium text-gray-700 mb-2 mt-2">Front View</h4>
                  </div>
                )}

                {showBack && (
                  <div>
                    <div className="relative w-full aspect-square bg-gray-100 rounded-xl shadow-lg border border-gray-300 overflow-hidden">
                      <img
                        src={getImageUrl('muscles/back.png')}
                        alt="Back muscle diagram"
                        className="absolute inset-0 w-full h-full object-contain"
                        onLoad={(e) => handleImageLoad('back', e)}
                        onError={() => console.error('Failed to load back image')}
                      />
                      
                      {generateMuscleSVG.back && generateMuscleSVG.back.length > 0 && (
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox={`0 0 ${backImageSize.width} ${backImageSize.height}`}
                          preserveAspectRatio="xMidYMid meet"
                        >
                          {generateMuscleSVG.back.map((point, idx) => (
                            <circle
                              key={`back-${idx}`}
                              cx={point.x}
                              cy={point.y}
                              r="1"
                              fill={point.color}
                              opacity="0.7"
                            />
                          ))}
                        </svg>
                      )}
                    </div>
                    <h4 className="text-md font-medium text-gray-700 mb-2 mt-2">Back View</h4>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Secondary</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {exercise.musclesTargeted && exercise.musclesTargeted.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Target className="text-indigo-600" size={28} />
              Secondary Muscles Worked
            </h2>
            <div className="flex flex-wrap gap-3">
              {exercise.musclesTargeted.map((m) => (
                <span
                  key={m}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {exercise.instructions && exercise.instructions.filter(i => i.trim()).length > 0 && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Perform</h2>
            <ol className="space-y-4">
              {exercise.instructions.filter(i => i.trim()).map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 text-lg leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {exercise.commonMistakes && exercise.commonMistakes.filter(m => m.trim()).length > 0 && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <AlertCircle className="text-red-600" size={28} />
              Common Mistakes
            </h2>
            <div className="space-y-4">
              {exercise.commonMistakes.filter(m => m.trim()).map((mistake, idx) => (
                <div key={idx} className="p-5 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                  <p className="text-gray-700 leading-relaxed">{mistake}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {exercise.tips && exercise.tips.filter(t => t.trim()).length > 0 && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Lightbulb className="text-yellow-600" size={28} />
              Pro Tips
            </h2>
            <div className="space-y-4">
              {exercise.tips.filter(t => t.trim()).map((tip, idx) => (
                <div key={idx} className="p-5 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl">
                  <p className="text-gray-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {exercise.calculator && (exercise.calculator.beginner.reps || exercise.calculator.intermediate.reps || exercise.calculator.advanced.reps) && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <TrendingUp className="text-indigo-600" size={28} />
              Performance Standards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['beginner', 'intermediate', 'advanced'] as const).map(level => {
                const data = exercise.calculator![level];
                if (!data.reps && !data.lbs && !data.oneRepMax) return null;
                return (
                  <div key={level} className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                    <h3 className="text-xl font-bold text-indigo-700 capitalize mb-4">{level}</h3>
                    {data.reps && <p className="text-gray-700"><strong>Reps:</strong> {data.reps}</p>}
                    {data.lbs && <p className="text-gray-700"><strong>Weight:</strong> {data.lbs} lbs</p>}
                    {data.oneRepMax && <p className="text-gray-700"><strong>1RM:</strong> {data.oneRepMax} lbs</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {lists && lists.length > 0 && onToggleList && (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Add to Lists
            </h2>
            <div className="space-y-2">
              {lists.map((list, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={list.exercises.includes(exercise.key)}
                    onChange={() => onToggleList(idx, exercise.key)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">{list.name}</span>
                    {list.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{list.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {list.exercises.length} exercise{list.exercises.length !== 1 ? 's' : ''}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
