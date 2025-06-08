import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string;
  hoverColor: string;
}

const dashboardItems: DashboardItem[] = [
  {
    id: 'movies',
    title: 'Películas',
    description: 'Descubre películas por género, actor o título',
    icon: '🎬',
    path: '/peliculas',
    color: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800',
    hoverColor: 'hover:from-blue-500 hover:via-blue-600 hover:to-indigo-700'
  },
  {
    id: 'books',
    title: 'Libros',
    description: 'Encuentra libros por autor y preferencias',
    icon: '📚',
    path: '/libros',
    color: 'bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800',
    hoverColor: 'hover:from-emerald-500 hover:via-green-600 hover:to-teal-700'
  },
  {
    id: 'history',
    title: 'Historial',
    description: 'Revisa tus búsquedas anteriores',
    icon: '📋',
    path: '/historial',
    color: 'bg-gradient-to-br from-purple-600 via-violet-700 to-fuchsia-800',
    hoverColor: 'hover:from-purple-500 hover:via-violet-600 hover:to-fuchsia-700'
  }
];

interface DashboardProps {
  compact?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ compact = false }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  if (compact || !isHomePage) {    // Versión compacta para páginas específicas
    return (
      <div className="max-w-6xl mx-auto py-2 sm:py-4 px-4">
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-white bg-opacity-10 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-lg">
            {dashboardItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`
                    relative group flex items-center space-x-2 sm:space-x-3 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 transform
                    ${isActive 
                      ? 'bg-white bg-opacity-20 text-white ring-2 ring-white ring-opacity-30 scale-105' 
                      : 'text-gray-300 hover:bg-white hover:bg-opacity-15 hover:text-white hover:scale-105'
                    }
                  `}
                >
                  {/* Efecto de resplandor */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 rounded-lg sm:rounded-xl transition-opacity duration-300"></div>
                  
                  <span className="text-lg sm:text-2xl transform group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                  <span className="font-medium text-sm sm:text-base">{item.title}</span>
                  
                  {isActive && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full animate-pulse shadow-lg"></div>
                    </div>
                  )}
                  
                  {/* Indicador de hover */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-300"></div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }  // Versión completa para la página principal
  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 px-4">
      <div className="text-center mb-8 sm:mb-12 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent animate-pulse">
          Centro de Recomendaciones
        </h1>
        <p className="text-lg sm:text-xl text-accent-light opacity-90">
          Elige una categoría para comenzar a explorar
        </p>
        <div className="mt-4 w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto"></div>
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
        {dashboardItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}              className={`
                relative group block p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl transition-all duration-500 transform
                ${item.color} ${item.hoverColor}
                ${isActive 
                  ? 'ring-4 ring-white ring-opacity-50 scale-105 shadow-3xl' 
                  : 'hover:scale-105 hover:shadow-3xl hover:-translate-y-2'
                }
              `}
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* Efecto de partículas flotantes */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-white opacity-20 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-1/4 -right-2 w-3 h-3 bg-white opacity-30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute -bottom-2 left-1/4 w-2 h-2 bg-white opacity-25 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
              </div>
              
              {/* Efecto de brillo mejorado */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-0 group-hover:opacity-20 rounded-2xl transition-all duration-500 transform group-hover:scale-110"></div>
              
              {/* Contenido */}
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 filter group-hover:drop-shadow-lg">
                  {item.icon}
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-shadow-lg transition-all duration-300">
                  {item.title}
                </h2>
                
                <p className="text-gray-100 text-sm opacity-90 group-hover:opacity-100 transition-all duration-300 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Indicador de activo mejorado */}
                {isActive && (
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
                      <div className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
                
                {/* Flecha de acción mejorada */}
                <div className="mt-8 flex justify-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-40 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-45">
                    <svg 
                      className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Borde animado */}
              <div className="absolute inset-0 rounded-2xl border-2 border-white border-opacity-0 group-hover:border-opacity-30 transition-all duration-300"></div>
            </Link>
          );
        })}
      </div>      {/* Estadísticas mejoradas */}
      <div className="text-center">
        <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl sm:rounded-3xl px-6 sm:px-8 lg:px-10 py-6 shadow-xl border border-white border-opacity-20 hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02]">
          <div className="text-center group">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-blue-500 transition-all duration-300">
              10K+
            </div>
            <div className="text-xs sm:text-sm text-accent-light group-hover:text-accent transition-colors duration-300">Películas</div>
          </div>
          <div className="w-12 h-px sm:w-px sm:h-12 bg-gradient-to-r sm:bg-gradient-to-b from-white via-white to-transparent opacity-30"></div>
          <div className="text-center group">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all duration-300">
              5K+
            </div>
            <div className="text-xs sm:text-sm text-accent-light group-hover:text-accent transition-colors duration-300">Libros</div>
          </div>
          <div className="w-12 h-px sm:w-px sm:h-12 bg-gradient-to-r sm:bg-gradient-to-b from-white via-white to-transparent opacity-30"></div>
          <div className="text-center group">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-purple-500 transition-all duration-300">
              ∞
            </div>
            <div className="text-xs sm:text-sm text-accent-light group-hover:text-accent transition-colors duration-300">Posibilidades</div>
          </div>
        </div>
        
        {/* Mensaje inspiracional */}
        <div className="mt-6 sm:mt-8 text-accent-light text-base sm:text-lg opacity-80 hover:opacity-100 transition-opacity duration-300">
          "Descubre tu próxima obsesión" ✨
        </div>
      </div>
    </div>
  );
};
