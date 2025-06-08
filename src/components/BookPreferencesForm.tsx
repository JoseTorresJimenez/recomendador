import React, { useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import type { MultiValue, StylesConfig } from 'react-select';

interface Props {
  onSubmit: (params: {
    authors: { name: string }[];
    title: string;
    genre: string;
  }) => void;
}

interface Option {
  label: string;
  value: string;
}

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
      borderColor: '#10B981',
      backgroundColor: '#1F2937'
    },
    '&:focus-within': {
      borderColor: '#10B981',
      boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)'
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
      ? '#10B981'
      : isFocused
      ? '#374151'
      : '#1F2937',
    color: '#fff',
    cursor: 'pointer',
    padding: '12px 16px',
    '&:hover': {
      backgroundColor: isSelected ? '#10B981' : '#374151'
    }
  }),
  multiValue: styles => ({
    ...styles,
    backgroundColor: '#10B981',
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
      backgroundColor: '#059669',
      color: '#ffffff'
    }
  }),
  placeholder: styles => ({
    ...styles,
    color: '#6EE7B7',
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

export const BookPreferencesForm: React.FC<Props> = ({ onSubmit }) => {
  const [authors, setAuthors] = useState<MultiValue<Option>>([]);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');

  const loadAuthorOptions = async (inputValue: string) => {
    const query = inputValue || 'a';
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(query)}&maxResults=40`
      );
      const { items } = await res.json();
      const seen = new Set<string>();
      return (
        items
          ?.flatMap((item: any) => item.volumeInfo.authors || [])
          .filter((a: string) => {
            if (seen.has(a)) return false;
            seen.add(a);
            return true;
          })
          .map((author: string) => ({ value: author, label: author })) || []
      );
    } catch {
      return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      authors: authors.map(a => ({ name: a.value })),
      title,
      genre,
    });
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Fondo con efectos visuales */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl sm:rounded-3xl blur-xl transform scale-105"></div>
      
      <form
        onSubmit={handleSubmit}
        className="relative space-y-6 sm:space-y-8 p-6 sm:p-8 lg:p-12 bg-neutral-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10"
      >
        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-xl">
            <span className="text-2xl sm:text-4xl">📚</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent px-4">
            Preferencias de Libros
          </h2>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            Personaliza tu búsqueda combinando autores, títulos y géneros para encontrar los libros perfectos
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Autores */}
          <div className="lg:col-span-2 group">
            <label className="mb-3 sm:mb-4 font-semibold text-green-300 text-lg sm:text-xl flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-sm sm:text-lg">✍️</span>
              </div>
              <span>Autores</span>
            </label>
            <div className="relative">
              <AsyncCreatableSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadAuthorOptions}
                value={authors}
                onChange={nv => setAuthors((nv || []) as MultiValue<Option>)}
                placeholder="Busca autores como Stephen King..."
                styles={{
                  ...customStyles,
                  control: styles => ({
                    ...customStyles.control!(styles, {} as any),
                    minHeight: window.innerWidth < 640 ? '48px' : '56px',
                    fontSize: window.innerWidth < 640 ? '14px' : '16px',
                  })
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 ml-1">
              Puedes seleccionar múltiples autores para obtener recomendaciones más variadas
            </p>
          </div>
          
          {/* Título */}
          <div className="group">
            <label className="mb-3 sm:mb-4 font-semibold text-green-300 text-lg sm:text-xl flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-sm sm:text-lg">📖</span>
              </div>
              <span>Título del Libro</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Harry Potter, El Quijote..."
                className="w-full h-12 sm:h-14 px-4 sm:px-6 bg-neutral-800/90 border border-neutral-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-400 transition-all duration-300 group-hover:border-green-500/50 text-sm sm:text-base touch-target"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          
          {/* Género */}
          <div className="group">
            <label className="mb-3 sm:mb-4 font-semibold text-green-300 text-lg sm:text-xl flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-sm sm:text-lg">🏷️</span>
              </div>
              <span>Género Literario</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Ej: Ficción, Fantasía, Romance, Misterio..."
                className="w-full h-12 sm:h-14 px-4 sm:px-6 bg-neutral-800/90 border border-neutral-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-400 transition-all duration-300 group-hover:border-teal-500/50 text-sm sm:text-base touch-target"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 sm:pt-8">
          <button
            type="submit"
            className="w-full h-12 sm:h-16 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-500/50 active:scale-[0.98] touch-target"
          >
            <span className="flex items-center justify-center space-x-2 sm:space-x-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Buscar Libros</span>
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
