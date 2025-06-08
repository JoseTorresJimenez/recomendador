// src/components/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();
  
  return (    <header className="relative bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="group flex items-center space-x-2 sm:space-x-4">
            {/* Logo/Icon */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m4 0a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h16zM7 8h10m-5 4h.01" />
              </svg>
            </div>
            
            {/* Title and subtitle */}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 truncate">
                Recomendador Multimedia
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm group-hover:text-gray-300 transition-colors duration-300 hidden sm:block">
                Descubre tus próximos libros y películas favoritas
              </p>
            </div>
          </Link>
            {/* Navigation breadcrumb */}
          {location.pathname !== '/' && (
            <div className="flex items-center space-x-2 sm:space-x-3 bg-white/5 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 border border-white/10">
              <Link 
                to="/" 
                className="text-gray-400 hover:text-white transition-colors duration-200 text-xs sm:text-sm font-medium flex items-center space-x-1"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden xs:inline">Inicio</span>
              </Link>
              
              <div className="w-px h-3 sm:h-4 bg-white/20"></div>
              
              <span className="text-white font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2">
                {location.pathname === '/peliculas' && (
                  <>
                    <span className="text-base sm:text-lg">🎬</span>
                    <span className="hidden xs:inline">Películas</span>
                  </>
                )}
                {location.pathname === '/libros' && (
                  <>
                    <span className="text-base sm:text-lg">📚</span>
                    <span className="hidden xs:inline">Libros</span>
                  </>
                )}
                {location.pathname === '/historial' && (
                  <>
                    <span className="text-base sm:text-lg">📋</span>
                    <span className="hidden xs:inline">Historial</span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
