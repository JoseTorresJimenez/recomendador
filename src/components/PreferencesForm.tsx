import React, { useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import type { MultiValue, StylesConfig } from 'react-select';

interface Props {
  onSubmit: (genres: string[], authors: string[]) => void;
}

interface Option {
  label: string;
  value: string;
}

// Tu API Key de TMDb desde .env
const TMDB_API_KEY = import.meta.env.VITE_TMDB_KEY!;
const TMDB_GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`;

const customStyles: StylesConfig<Option, true> = {
  control: styles => ({
    ...styles,
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    '&:hover': { borderColor: '#10B981' },
  }),
  menu: styles => ({
    ...styles,
    backgroundColor: '#1F2937',
  }),
  menuList: styles => ({
    ...styles,
    maxHeight: '300px',
    overflowY: 'auto',
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? '#047857'
      : isFocused
      ? '#10B981'
      : '#1F2937',
    color: isSelected || isFocused ? '#ffffff' : '#d1d5db',
    cursor: 'pointer',
  }),
  multiValue: styles => ({
    ...styles,
    backgroundColor: '#10B981',
  }),
  multiValueLabel: styles => ({
    ...styles,
    color: '#ffffff',
  }),
  placeholder: styles => ({
    ...styles,
    color: '#6EE7B7',
    opacity: 0.9,
  }),
  singleValue: styles => ({
    ...styles,
    color: '#ffffff',
  }),
  input: styles => ({
    ...styles,
    color: '#ffffff',
  }),
};

export const PreferencesForm: React.FC<Props> = ({ onSubmit }) => {
  const [genres, setGenres] = useState<MultiValue<Option>>([]);
  const [authors, setAuthors] = useState<MultiValue<Option>>([]);

  // Carga dinámica de géneros desde TMDb
  const loadGenreOptions = async (inputValue: string) => {
    try {
      const res = await fetch(TMDB_GENRE_URL);
      const { genres: list } = await res.json();
      const options: Option[] = list.map((g: any) => ({
        value: String(g.id),
        label: g.name,
      }));
      return options.filter(opt =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch {
      return [];
    }
  };

  // Carga dinámica de autores: si input vacío, hace búsqueda con 'a'
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
    onSubmit(
      genres.map(g => g.value),
      authors.map(a => a.value)
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8 bg-neutral-900 rounded-2xl shadow-card max-w-lg mx-auto mobile-card-shadow"
    >
      <h2 className="text-2xl sm:text-3xl font-semibold text-accent text-center mobile-heading-scale">
        Tus Preferencias
      </h2>

      {/* Géneros */}
      <div>
        <label className="block mb-2 font-medium text-accent-light mobile-text-scale">
          Géneros de Películas
        </label>
        <div className="min-h-[44px]">
          <AsyncCreatableSelect
            isMulti
            cacheOptions
            defaultOptions
            loadOptions={loadGenreOptions}
            value={genres}
            onChange={nv => setGenres((nv || []) as MultiValue<Option>)}
            placeholder="Selecciona o escribe géneros..."
            styles={customStyles}
            className="focus-visible-enhanced"
          />
        </div>
      </div>

      {/* Autores */}
      <div>
        <label className="block mb-2 font-medium text-accent-light mobile-text-scale">
          Autores de Libros
        </label>
        <div className="min-h-[44px]">
          <AsyncCreatableSelect
            isMulti
            cacheOptions
            defaultOptions
            loadOptions={loadAuthorOptions}
            value={authors}
            onChange={nv => setAuthors((nv || []) as MultiValue<Option>)}
            placeholder="Selecciona o escribe autores..."
            styles={customStyles}
            className="focus-visible-enhanced"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 sm:py-4 rounded-lg bg-accent hover:bg-accent-dark text-white font-medium transition touch-target focus-visible-enhanced mobile-button-enhanced mobile-text-scale"
      >
        Obtener recomendaciones
      </button>
    </form>
  );
};
