import { z } from 'zod';
import { Exercise, ExerciseList, ExerciseData } from './types';

export const exerciseCalculatorSchema = z.object({
  beginner: z.object({
    reps: z.string(),
    lbs: z.string(),
    oneRepMax: z.string(),
  }),
  intermediate: z.object({
    reps: z.string(),
    lbs: z.string(),
    oneRepMax: z.string(),
  }),
  advanced: z.object({
    reps: z.string(),
    lbs: z.string(),
    oneRepMax: z.string(),
  }),
});

export const exerciseSchema = z.object({
  name: z.string(),
  key: z.string(),
  calculator: exerciseCalculatorSchema,
  videoLink: z.string().optional(),
  description: z.string().optional(),
  musclesTargeted: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  instructions: z.array(z.string()).optional(),
  commonMistakes: z.array(z.string()).optional(),
  tips: z.array(z.string()).optional(),
  thumbnailLink: z.string().optional(),
  primaryMuscle: z.string().optional(),
  hasVideo: z.boolean().optional(),
});

export const exerciseListSchema = z.object({
  name: z.string(),
  description: z.string(),
  exercises: z.array(z.string()),
  createdDate: z.string(),
  tags: z.array(z.string()),
});

export const exerciseDataSchema = z.object({
  exercises: z.array(exerciseSchema),
  lists: z.array(exerciseListSchema),
});

export const validateExerciseData = (data: unknown): ExerciseData => {
  const result = exerciseDataSchema.safeParse(data);
  
  if (result.success) {
    return result.data as ExerciseData;
  }
  
  // At this point, result must be an error
  const errorResult = result as z.SafeParseError<typeof exerciseDataSchema>;
  const errors = errorResult.error.issues.map((err) => ({
    path: err.path.join('.') || '',
    message: err.message || 'Unknown error'
  }));
  
  throw new Error(`Validation failed: ${JSON.stringify(errors, null, 2)}`);
};

export const validateSingleExercise = (data: unknown): Exercise => {
  const result = exerciseSchema.safeParse(data);
  
  if (result.success) {
    return result.data as Exercise;
  }
  
  // At this point, result must be an error
  const errorResult = result as z.SafeParseError<typeof exerciseSchema>;
  const errors = errorResult.error.issues.map((err) => ({
    path: err.path.join('.') || '',
    message: err.message || 'Unknown error'
  }));
  
  throw new Error(`Validation failed: ${JSON.stringify(errors, null, 2)}`);
};
