// src/components/SkeletonCard.tsx
import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl shadow-card bg-neutral-800 animate-pulse overflow-hidden">
    <div className="w-full h-48 bg-neutral-700"></div>
    <div className="p-4">
      <div className="h-6 bg-neutral-700 rounded mb-2"></div>
      <div className="h-4 bg-neutral-700 rounded w-5/6"></div>
    </div>
  </div>
);
