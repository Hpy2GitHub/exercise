// src/components/ExerciseMedia.tsx
import { useState } from 'react';
import { features } from "../config/features";

interface ExerciseMediaProps {
  name: string;
  hasVideo?: boolean;
  videoUrl: string | null;
  posterUrl?: string;
  fallbackImageUrl: string | null;
}

export const ExerciseMedia: React.FC<ExerciseMediaProps> = ({
  name,
  hasVideo,
  videoUrl,
  posterUrl,
  fallbackImageUrl,
}) => {
  const [videoError, setVideoError] = useState(false);

  const showVideo = features.showVideos && hasVideo !== false && videoUrl && !videoError;
  const showImage = !showVideo && features.showImages && fallbackImageUrl;

  if (!showVideo && !showImage) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Play Exercise Demo
      </h3>
      {showVideo ? (
        <video
          src={videoUrl!}
          controls
          poster={posterUrl}
          className="w-full rounded-xl shadow-2xl"
          preload="metadata"
          onError={() => setVideoError(true)}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={fallbackImageUrl!}
          alt={name}
          className="w-full rounded-xl shadow-2xl"
        />
      )}
    </div>
  );
};
