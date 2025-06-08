// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const handleTechLinkClick = (type: 'tmdb' | 'books' | 'react') => {
  const urls = {
    tmdb: 'https://www.themoviedb.org/',
    books: 'https://developers.google.com/books',
    react: 'https://react.dev/'
  };
  window.open(urls[type], '_blank', 'noopener,noreferrer');
};

const handleSocialClick = (action: 'star' | 'share' | 'feedback') => {
  switch (action) {
    case 'star':
      // Simular acción de "favoritos"
      const favorites = JSON.parse(localStorage.getItem('app-favorites') || '[]');
      favorites.push({ type: 'app', timestamp: Date.now() });
      localStorage.setItem('app-favorites', JSON.stringify(favorites));
      alert('¡Gracias! La aplicación ha sido añadida a tus favoritos ⭐');
      break;
    case 'share':
      // Compartir la aplicación
      if (navigator.share) {
        navigator.share({
          title: 'Recomendador Multimedia',
          text: 'Descubre tus próximas películas y libros favoritos',
          url: window.location.href
        });
      } else {
        // Fallback para navegadores que no soportan Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('¡Enlace copiado al portapapeles! Compártelo con tus amigos 🚀');
        });
      }
      break;
    case 'feedback':
      // Abrir modal de feedback o mailto
      const subject = encodeURIComponent('Feedback - Recomendador Multimedia');
      const body = encodeURIComponent('Hola! Me gustaría compartir mi feedback sobre la aplicación:\n\n');
      window.open(`mailto:feedback@recomendador.app?subject=${subject}&body=${body}`, '_blank');
      break;
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const Footer: React.FC = () => (
  <footer className="relative bg-white/5 backdrop-blur-xl border-t border-white/10 py-8 sm:py-12 px-4 sm:px-6 mt-12 sm:mt-20">
    {/* Decorative gradient line */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
    
    {/* Subtle background effects */}
    <div className="absolute inset-0">
      <div className="absolute bottom-0 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
    </div>
    
    <div className="relative max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">        {/* Branding */}
        <div className="text-center sm:text-left lg:col-span-1">
          <div 
            className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 mb-3 sm:mb-4 cursor-pointer group"
            onClick={scrollToTop}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m4 0a2 2 0 012 2v12a2 2 0 01-2-2H4a2 2 0 01-2-2V6a2 2 0 012-2h16zM7 8h10m-5 4h.01" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
              Recomendador Multimedia
            </h3>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto sm:mx-0">
            Descubre tu próxima película favorita o tu próximo gran libro y descubre nuevas historias increíbles.
          </p>
        </div>
        
        {/* Navigation Links */}
        <div className="text-center sm:col-span-1 lg:col-span-1">
          <h4 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center justify-center space-x-2">
            <span>🗺️</span>
            <span>Explorar</span>
          </h4>
          <div className="space-y-2 sm:space-y-3">
            <Link 
              to="/peliculas" 
              className="group flex items-center justify-center space-x-2 sm:space-x-3 text-gray-300 hover:text-blue-400 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-white/5"
            >
              <span className="text-base sm:text-lg group-hover:scale-110 transition-transform duration-300">🎬</span>
              <span className="font-medium text-sm sm:text-base">Películas</span>
            </Link>
            <Link 
              to="/libros" 
              className="group flex items-center justify-center space-x-2 sm:space-x-3 text-gray-300 hover:text-green-400 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-white/5"
            >
              <span className="text-base sm:text-lg group-hover:scale-110 transition-transform duration-300">📚</span>
              <span className="font-medium text-sm sm:text-base">Libros</span>
            </Link>
            <Link 
              to="/historial" 
              className="group flex items-center justify-center space-x-2 sm:space-x-3 text-gray-300 hover:text-purple-400 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-white/5"
            >
              <span className="text-base sm:text-lg group-hover:scale-110 transition-transform duration-300">📋</span>
              <span className="font-medium text-sm sm:text-base">Historial</span>
            </Link>
          </div>
        </div>
        
        {/* Tech Stack */}
        <div className="text-center sm:col-span-2 lg:col-span-1 lg:text-right">
          <h4 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center justify-center lg:justify-end space-x-2">
            <span>⚡</span>
            <span>Tecnología</span>
          </h4>
          <div className="space-y-2 sm:space-y-3">
            <button 
              onClick={() => handleTechLinkClick('tmdb')}
              className="group flex items-center justify-center lg:justify-end space-x-2 sm:space-x-3 text-gray-300 hover:text-yellow-400 transition-all duration-300 p-2 rounded-lg hover:bg-white/5 cursor-pointer w-full touch-target"
            >
              <span className="text-base sm:text-lg group-hover:scale-110 transition-transform duration-300">🎭</span>
              <span className="text-xs sm:text-sm font-medium">TMDB API</span>
              <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <button 
              onClick={() => handleTechLinkClick('books')}
              className="group flex items-center justify-center lg:justify-end space-x-2 sm:space-x-3 text-gray-300 hover:text-blue-400 transition-all duration-300 p-2 rounded-lg hover:bg-white/5 cursor-pointer w-full touch-target"
            >
              <span className="text-base sm:text-lg group-hover:scale-110 transition-transform duration-300">📖</span>
              <span className="text-xs sm:text-sm font-medium">Google Books</span>
              <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <button 
              onClick={() => handleTechLinkClick('react')}
              className="group flex items-center justify-center lg:justify-end space-x-2 sm:space-x-3 text-gray-300 hover:text-cyan-400 transition-all duration-300 p-2 rounded-lg hover:bg-white/5 cursor-pointer w-full touch-target"
            >
              <span className="text-base sm:text-lg group-hover:scale-110 transition-transform duration-300">⚛️</span>
              <span className="text-xs sm:text-sm font-medium">React + TypeScript</span>
              <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Divider with gradient */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-1 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Bottom section */}
      <div className="pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm flex items-center space-x-2">
            <span>©</span>
            <span>{new Date().getFullYear()}</span>
            <span>Recomendador Multimedia.</span>
            <span className="hidden md:inline">Todos los derechos reservados.</span>
          </p>
          
          {/* Interactive action buttons */}
          <div className="flex items-center space-x-3">            <button
              onClick={() => handleSocialClick('star')}
              className="group w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer hover:scale-110 border border-white/10 hover:border-white/20 touch-target"
              title="Marcar como favorito"
            >
              <span className="text-sm sm:text-lg group-hover:animate-pulse">💫</span>
            </button>
            <button
              onClick={() => handleSocialClick('share')}
              className="group w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg sm:rounded-xl flex items-center justify-center hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 cursor-pointer hover:scale-110 border border-white/10 hover:border-white/20 touch-target"
              title="Compartir aplicación"
            >
              <span className="text-sm sm:text-lg group-hover:animate-pulse">🌟</span>
            </button>
            <button
              onClick={() => handleSocialClick('feedback')}
              className="group w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg sm:rounded-xl flex items-center justify-center hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-pointer hover:scale-110 border border-white/10 hover:border-white/20 touch-target"
              title="Enviar feedback"
            >
              <span className="text-sm sm:text-lg group-hover:animate-pulse">✨</span>
            </button>
          </div>        </div>
      </div>
    </div>
  </footer>
);
