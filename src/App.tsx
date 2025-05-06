import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PreferencesForm } from './components/PreferencesForm';
import { RecommendationCard } from './components/RecommendationCard';
import { SkeletonCard } from './components/SkeletonCard';
import { useRecommendations } from './hooks/useRecommendations';

type Filter = 'all' | 'movies' | 'books';

export default function App() {
  const { movies, books, loading, getRecommendations } = useRecommendations();
  // Guardamos las últimas preferencias
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  const onSubmit = (genres: string[], authors: string[]) => {
    setSelectedGenres(genres);
    setSelectedAuthors(authors);
    getRecommendations(genres, authors);
    setFilter('all'); // opcional: resetear filtro al buscar
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'movies', label: 'Películas' },
    { key: 'books', label: 'Libros' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary to-accent-dark">
      <Header />

      <main className="flex-grow py-10 px-4 text-neutral-light">
        <PreferencesForm onSubmit={onSubmit} />

        <div className="flex justify-center space-x-4 mt-6">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`
                px-5 py-2 rounded-xl transform transition duration-200
                hover:scale-105 active:scale-95
                ${filter === key
                  ? 'bg-primary text-white'
                  : 'bg-neutral-700 text-neutral-light hover:bg-neutral-600 hover:text-white'}
              `}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 max-w-5xl mx-auto">
          {loading ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="border-4 border-t-accent border-neutral-700 rounded-full w-12 h-12 animate-spin"></div>
              </div>
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </section>
            </>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filter === 'books' && selectedAuthors.length === 0 && (
                <p className="col-span-full text-center text-accent-light">
                  No has seleccionado ningún autor. Ingresa autores para ver libros.
                </p>
              )}

              {filter === 'movies' && selectedGenres.length === 0 && (
                <p className="col-span-full text-center text-accent-light">
                  No has seleccionado ningún género de pelicula. Ingresa géneros para ver películas.
                </p>
              )}

              {filter !== 'books' && selectedGenres.length > 0 && movies.length === 0 && (
                <p className="col-span-full text-center text-accent-light">
                  No se encontraron películas para los géneros seleccionados.
                </p>
              )}

              {filter !== 'movies' && selectedAuthors.length > 0 && books.length === 0 && (
                <p className="col-span-full text-center text-accent-light">
                  No se encontraron libros para los autores seleccionados.
                </p>
              )}

              {filter !== 'books' &&
                movies.map(m => (
                  <RecommendationCard
                    key={m.id}
                    title={m.title}
                    imageUrl={m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : undefined}
                    description={m.overview}
                    link={`https://www.themoviedb.org/movie/${m.id}`}
                  />
                ))}

              {filter !== 'movies' &&
                books.map(b => (
                  <RecommendationCard
                    key={b.id}
                    title={b.volumeInfo.title}
                    imageUrl={b.volumeInfo.imageLinks?.thumbnail}
                    description={b.volumeInfo.description}
                    link={`https://books.google.com/books?id=${b.id}`}
                  />
                ))}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
