import React from 'react';

export const RecommendationCard: React.FC<{
  title: string;
  imageUrl?: string;
  description?: string;
  link: string;
}> = ({ title, imageUrl, description, link }) => (
  <div className="group relative">
    {/* Efecto de fondo con blur */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform scale-110"></div>
    
    <a
      href={link}
      target="_blank"
      rel="noopener"
      className="
        relative block overflow-hidden rounded-3xl shadow-2xl
        bg-neutral-900/90 backdrop-blur-sm border border-white/10
        hover:shadow-3xl hover:border-white/20 transition-all duration-500
        transform hover:-translate-y-2 hover:scale-[1.02]
        before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/50 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
      "
    >
      {imageUrl && (
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent opacity-60"></div>
          
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </div>
      )}
      
      <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Título con efecto gradient */}
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300 line-clamp-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-colors duration-300">
            {description}
          </p>
        )}
        
        {/* Indicador de acción */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
            <span className="text-sm font-medium">Ver más</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          {/* Icono de enlace externo */}
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Borde animado */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/50 group-hover:via-purple-500/50 group-hover:to-pink-500/50 transition-all duration-500 mask-border"></div>
    </a>
  </div>
);
