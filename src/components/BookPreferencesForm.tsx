import React, { useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import type { MultiValue, StylesConfig } from 'react-select';

interface Props {
  onSubmit: (authors: { name: string }[]) => void;
}

interface Option {
  label: string;
  value: string;
}

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

export const BookPreferencesForm: React.FC<Props> = ({ onSubmit }) => {
  const [authors, setAuthors] = useState<MultiValue<Option>>([]);

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
    onSubmit(authors.map(a => ({ name: a.value })));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-8 bg-neutral-900 rounded-2xl shadow-card max-w-lg mx-auto"
    >
      <h2 className="text-3xl font-semibold text-accent text-center">
        Tus Preferencias de Libros
      </h2>
      <div>
        <label className="block mb-1 font-medium text-accent-light">
          Autores de Libros
        </label>
        <AsyncCreatableSelect
          isMulti
          cacheOptions
          defaultOptions
          loadOptions={loadAuthorOptions}
          value={authors}
          onChange={nv => setAuthors((nv || []) as MultiValue<Option>)}
          placeholder="Selecciona o escribe autores..."
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