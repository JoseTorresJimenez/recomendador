import React, { useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import type { MultiValue, StylesConfig } from 'react-select';

interface Props {
  onSubmit: (params: {
    genres: { id: string; name: string }[];
    title: string;
    actor: string;
  }) => void;
}

interface Option {
  label: string;
  value: string;
}

const TMDB_API_KEY = import.meta.env.VITE_TMDB_KEY!;
const TMDB_GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`;

const customStyles: StylesConfig<Option, true> = {
  control: styles => ({
    ...styles,
    backgroundColor: '#1F2937',
    borderColor: '#374151',
    color: '#fff',
    minHeight: '56px',
    borderRadius: '0.75rem',
    borderWidth: '1px',
    boxShadow: 'none',
    '&:hover': { 
      borderColor: '#3B82F6',
      backgroundColor: '#1F2937'
    },
    '&:focus-within': {
      borderColor: '#3B82F6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  }),
  menu: styles => ({
    ...styles,
    backgroundColor: '#1F2937',
    color: '#fff',
    borderRadius: '0.75rem',
    border: '1px solid #374151',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  }),
  menuList: styles => ({
    ...styles,
    maxHeight: '300px',
    overflowY: 'auto',
    color: '#fff',
    borderRadius: '0.75rem',
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? '#3B82F6'
      : isFocused
      ? '#374151'
      : '#1F2937',
    color: '#fff',
    cursor: 'pointer',
    padding: '12px 16px',
    '&:hover': {
      backgroundColor: isSelected ? '#3B82F6' : '#374151'
    }
  }),
  multiValue: styles => ({
    ...styles,
    backgroundColor: '#3B82F6',
    borderRadius: '0.5rem',
  }),
  multiValueLabel: styles => ({
    ...styles,
    color: '#ffffff',
    padding: '4px 8px',
  }),
  multiValueRemove: styles => ({
    ...styles,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#2563EB',
      color: '#ffffff'
    }
  }),
  placeholder: styles => ({
    ...styles,
    color: '#93C5FD',
    opacity: 0.8,
  }),
  singleValue: styles => ({
    ...styles,
    color: '#fff',
  }),
  input: styles => ({
    ...styles,
    color: '#fff',
  }),
};

export const MoviePreferencesForm: React.FC<Props> = ({ onSubmit }) => {
  const [genres, setGenres] = useState<MultiValue<Option>>([]);
  const [genreOptions, setGenreOptions] = useState<Option[]>([]);
  const [title, setTitle] = useState('');
  const [actor, setActor] = useState('');

  const loadGenreOptions = async (inputValue: string) => {
    // Use cached options if available
    if (genreOptions.length > 0) {
      return genreOptions.filter(opt =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }

    try {
      const res = await fetch(TMDB_GENRE_URL);
      const { genres: list } = await res.json();
      const options: Option[] = list.map((g: any) => ({
        value: String(g.id),
        label: g.name,
      }));
      setGenreOptions(options);
      return options.filter(opt =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch {
      return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      genres: genres.map(g => ({ id: g.value, name: g.label })),
      title,
      actor,
    });
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Fondo con efectos visuales */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl sm:rounded-3xl blur-xl transform scale-105"></div>
      
      <form
        onSubmit={handleSubmit}
        className="relative space-y-6 sm:space-y-8 p-6 sm:p-8 lg:p-12 bg-neutral-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10"
      >
        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-xl">
            <span className="text-2xl sm:text-4xl">🎬</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent px-4">
            Preferencias de Películas
          </h2>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            Personaliza tu búsqueda combinando géneros, títulos y actores para encontrar las películas perfectas
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Géneros */}
          <div className="lg:col-span-2 group">
            <label className="mb-3 sm:mb-4 font-semibold text-blue-300 text-lg sm:text-xl flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-sm sm:text-lg">🎭</span>
              </div>
              <span>Géneros de Películas</span>
            </label>
            <div className="relative">
              <AsyncCreatableSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadGenreOptions}
                value={genres}
                onChange={nv => setGenres((nv || []) as MultiValue<Option>)}
                placeholder="Selecciona géneros como Acción, Drama..."
                styles={{
                  ...customStyles,
                  control: styles => ({
                    ...customStyles.control!(styles, {} as any),
                    minHeight: window.innerWidth < 640 ? '48px' : '56px',
                    fontSize: window.innerWidth < 640 ? '14px' : '16px',
                  })
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 ml-1">
              Puedes seleccionar múltiples géneros para refinar tu búsqueda
            </p>
          </div>
          
          {/* Título */}
          <div className="group">
            <label className="mb-3 sm:mb-4 font-semibold text-blue-300 text-lg sm:text-xl flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-sm sm:text-lg">📽️</span>
              </div>
              <span>Título de Película</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Avengers, Matrix, Pulp Fiction..."
                className="w-full h-12 sm:h-14 px-4 sm:px-6 bg-neutral-800/90 border border-neutral-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-500/50 text-sm sm:text-base touch-target"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          
          {/* Actor */}
          <div className="group">
            <label className="mb-3 sm:mb-4 font-semibold text-blue-300 text-lg sm:text-xl flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-sm sm:text-lg">⭐</span>
              </div>
              <span>Actor Principal</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={actor}
                onChange={(e) => setActor(e.target.value)}
                placeholder="Ej: Leonardo DiCaprio, Scarlett Johansson..."
                className="w-full h-12 sm:h-14 px-4 sm:px-6 bg-neutral-800/90 border border-neutral-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-500/30 focus:border-pink-400 transition-all duration-300 group-hover:border-pink-500/50 text-sm sm:text-base touch-target"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-red-500/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 sm:pt-8">
          <button
            type="submit"
            className="w-full h-12 sm:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-purple-500/50 active:scale-[0.98] touch-target"
          >
            <span className="flex items-center justify-center space-x-2 sm:space-x-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Buscar Películas</span>
            </span>
          </button>
        </div>

        {/* Helper Text */}
        <div className="text-center pt-2 sm:pt-4">
          <p className="text-gray-400 text-xs sm:text-sm">
            💡 <span className="font-medium">Consejo:</span> Combina diferentes criterios para obtener mejores recomendaciones
          </p>
        </div>
      </form>
    </div>
  );
};