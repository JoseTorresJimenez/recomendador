import React, { useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import type { MultiValue, StylesConfig } from 'react-select';

interface Props {
  onSubmit: (genres: { id: string; name: string }[]) => void;
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
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    color: '#fff',
    '&:hover': { borderColor: '#10B981' },
  }),
  menu: styles => ({
    ...styles,
    backgroundColor: '#1F2937',
    color: '#fff',
  }),
  menuList: styles => ({
    ...styles,
    maxHeight: '300px',
    overflowY: 'auto',
    color: '#fff',
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? '#047857'
      : isFocused
      ? '#10B981'
      : '#1F2937',
    color: '#fff',
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

  const loadGenreOptions = async (inputValue: string) => {
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
    onSubmit(genres.map(g => ({ id: g.value, name: g.label })));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-8 bg-neutral-900 rounded-2xl shadow-card max-w-lg mx-auto"
    >
      <h2 className="text-3xl font-semibold text-accent text-center">
        Tus Preferencias de Películas
      </h2>
      <div>
        <label className="block mb-1 font-medium text-accent-light">
          Géneros de Películas
        </label>
        <AsyncCreatableSelect
          isMulti
          cacheOptions
          defaultOptions
          loadOptions={loadGenreOptions}
          value={genres}
          onChange={nv => setGenres((nv || []) as MultiValue<Option>)}
          placeholder="Selecciona o escribe géneros..."
          styles={customStyles}
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-accent hover:bg-accent-dark text-white font-medium transition"
      >
        Obtener recomendaciones
      </button>
    </form>
  );
};