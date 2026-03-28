// src/data/defaultExercises.tsx
// Sample data shown on first launch (before any import or API data is available).
// This file is auto-generated. Do not edit directly.

import { Exercise, ExerciseList, ExportData } from '../types';

const DEFAULT_EXERCISES: Exercise[] = [
  {
    name: "Leg Pull-In",
    key: "leg-pull-in",
    thumbnailLink: "leg-pull-in.jpg",
    videoLink: "leg-pull-in.mp4",
    hasVideo: true,
    description: "Leg Pull in is a bodyweight exercise that targets your core. By raising your legs off the ground, you're already engaging your core. Additionally your core helps to pull your legs in towards your chest.",
    primaryMuscle: "Abs",
    musclesTargeted: ["Abs"],
    equipment: ["Body Weight"],
    difficulty: "Beginner",
    instructions: ["Lie on your back with your knees extended and arms by your sides with your palms facing down.", "Brace your torso by breathing into your stomach and flexing your abdominal muscles.", "Keep your arms on the floor as you pull your knees up to your chest while keeping your shins parallel with the floor.", "Once your thighs come into contact with your midsection, hold this position for a moment. ", "Lower your legs under control to the starting position.Leg Pull in is a bodyweight exercise that targets your core. By raising your legs off the ground, you're already engaging your core. Additionally your core helps to pull your legs in towards your chest. "],
    commonMistakes: ["    Dropping Your Heels      Don't allow your heels to drop between reps. Keep them elevated throughout the entire exercise. You would be able to perform more reps by giving yourself some time to rest between reps, however it will make this exercise less effective. Focus on keeping your core engaged, and your legs elevated."],
    tips: [""],
    calculator: {
      beginner: {
        reps: "3",
        lbs: "9",
        oneRepMax: "10"
      },
      intermediate: {
        reps: "4",
        lbs: "9",
        oneRepMax: "11"
      },
      advanced: {
        reps: "4",
        lbs: "10",
        oneRepMax: "12"
      }
    }
  },
  {
    name: "Cross Body Hammer Curl",
    key: "cross-body-hammer-curl",
    thumbnailLink: "cross-body-hammer-curl.jpg",
    videoLink: "cross-body-hammer-curl.mp4",
    hasVideo: true,
    description: "",
    primaryMuscle: "Biceps",
    musclesTargeted: ["Biceps"],
    equipment: ["Dumbbells"],
    difficulty: "Beginner",
    instructions: [""],
    commonMistakes: [""],
    tips: [""],
    calculator: {
      beginner: {
        reps: "",
        lbs: "",
        oneRepMax: ""
      },
      intermediate: {
        reps: "",
        lbs: "",
        oneRepMax: ""
      },
      advanced: {
        reps: "",
        lbs: "",
        oneRepMax: ""
      }
    }
  },
  {
    name: "Airplane",
    key: "airplane",
    thumbnailLink: "airplane.jpg",
    videoLink: "airplane.mp4",
    hasVideo: true,
    description: "Airplane is a bodyweight balance exercise that primarily targets the glutes, hamstrings, and lower back. By standing on one leg and extending your arms and opposite leg out, this exercise adds significant instability, helping to improve balance and muscle coordination. This is a great exercise for enhancing proprioception and functional strength, especially in stabilizing muscles.",
    primaryMuscle: "Hamstrings",
    musclesTargeted: [],
    equipment: ["Body Weight"],
    difficulty: "Beginner",
    instructions: ["Stand with feet shoulder-width apart, arms at sides, and gaze ahead for balance.", "Extend arms outward for balance and lift one leg back, bending forward until your leg and chest are close to parallel to the ground.", "Rotate your torso in towards your stance leg followed by rotating it away.", "Make sure your heel is planted onto the ground throughout the entire exercise and you should feel muscle activation in your upper hamstrings and glutes of your stance leg."],
    commonMistakes: [""],
    tips: [""],
    calculator: {
      beginner: {
        reps: "",
        lbs: "",
        oneRepMax: ""
      },
      intermediate: {
        reps: "",
        lbs: "",
        oneRepMax: ""
      },
      advanced: {
        reps: "",
        lbs: "",
        oneRepMax: ""
      }
    }
  }
];

const DEFAULT_LISTS: ExerciseList[] = [
  {
    name: "Sample Workout",
    description: "A sample workout featuring 3 exercises to get you started.",
    exercises: ["leg-pull-in", "cross-body-hammer-curl", "airplane"],
    createdDate: new Date().toISOString(),
    tags: ["sample", "beginner", "full-body"]
  }
];

export const DEFAULT_DATA: ExportData = {
  exercises: DEFAULT_EXERCISES,
  lists: DEFAULT_LISTS,
};

// Returns true if the current exercise list appears to be the unmodified defaults.
// Used to decide whether to show the "using sample data" banner.
export function isUsingDefaultData(exercises: Exercise[]): boolean {
  if (exercises.length !== DEFAULT_EXERCISES.length) return false;
  const defaultKeys = new Set(DEFAULT_EXERCISES.map(e => e.key));
  return exercises.every(e => defaultKeys.has(e.key));
}
