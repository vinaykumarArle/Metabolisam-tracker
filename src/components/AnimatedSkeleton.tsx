import React from 'react';

interface AnimatedSkeletonProps {
  count?: number;
}

export const AnimatedSkeleton: React.FC<AnimatedSkeletonProps> = ({ count = 1 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-16 bg-slate-800 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );
};
