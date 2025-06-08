// src/components/SkeletonCard.tsx
import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="group relative">
    {/* Efecto de fondo con shimmer */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-600/10 to-gray-700/10 rounded-2xl sm:rounded-3xl blur-sm"></div>
    
    <div className="relative rounded-2xl sm:rounded-3xl shadow-2xl bg-neutral-900/90 backdrop-blur-sm border border-white/10 overflow-hidden animate-pulse mobile-card-shadow">
      {/* Imagen skeleton con gradiente animado */}
      <div className="relative w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-neutral-700 to-neutral-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-shimmer"></div>
      </div>
      
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">        {/* Título skeleton */}
        <div className="space-y-2">
          <div className="h-6 sm:h-7 bg-gradient-to-r from-neutral-700 to-neutral-600 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-shimmer"></div>
          </div>
          <div className="h-4 sm:h-5 bg-gradient-to-r from-neutral-700 to-neutral-600 rounded-lg w-4/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-shimmer"></div>
          </div>
        </div>
        
        {/* Descripción skeleton */}
        <div className="space-y-2">
          <div className="h-3 sm:h-4 bg-gradient-to-r from-neutral-700 to-neutral-600 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-shimmer"></div>
          </div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-neutral-700 to-neutral-600 rounded w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-shimmer"></div>
          </div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-neutral-700 to-neutral-600 rounded w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-shimmer"></div>
          </div>
        </div>
        
        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-3 sm:h-4 bg-gradient-to-r from-neutral-700 to-neutral-600 rounded w-16 sm:w-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-shimmer"></div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-neutral-700 to-neutral-600 rounded-full relative overflow-hidden touch-target">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
