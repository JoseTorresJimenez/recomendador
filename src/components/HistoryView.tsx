import React from 'react';
import { useSearchHistory } from '../hooks/useSearchHistory';

function formatFilters(item: any) {
  if (item.type === 'movie' && item.filters.genres) {
    return `Géneros: ${item.filters.genres.join(', ')}`;
  }
  if (item.type === 'book' && item.filters.authors) {
    return `Autores: ${item.filters.authors.join(', ')}`;
  }
  return '';
}

export const HistoryView: React.FC = () => {
  const [type, setType] = React.useState<'movie' | 'book' | ''>('');
  const [query, setQuery] = React.useState('');
  const { history, loading } = useSearchHistory(type || undefined, query);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-neutral-900 rounded-2xl shadow-card mt-8">
      <h2 className="text-3xl font-bold text-accent mb-6 text-center">Historial de Búsquedas</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
        <select
          className="bg-neutral-800 text-white rounded px-3 py-2"
          value={type}
          onChange={e => setType(e.target.value as any)}
        >
          <option value="">Todos</option>
          <option value="movie">Películas</option>
          <option value="book">Libros</option>
        </select>
        <input
          className="bg-neutral-800 text-white rounded px-3 py-2 flex-1"
          placeholder="Buscar por texto, género o autor..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      {loading ? (
        <p className="text-accent-light text-center">Cargando...</p>
      ) : history.length === 0 ? (
        <p className="text-accent-light text-center">No hay búsquedas registradas.</p>
      ) : (
        <ul className="divide-y divide-neutral-700">
          {history.slice(0, 15).map((item, i) => (
            <li key={i} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold mr-2 ${item.type === 'movie' ? 'bg-primary text-white' : 'bg-accent text-white'}`}>
                  {item.type === 'movie' ? 'Película' : 'Libro'}
                </span>
                <span className="font-semibold text-neutral-100 text-lg">
                  {item.query}
                </span>
                <span className="block text-neutral-400 text-sm mt-1">
                  {formatFilters(item)}
                </span>
              </div>
              <span className="text-neutral-400 text-xs min-w-fit text-right">
                {new Date(item.timestamp).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
