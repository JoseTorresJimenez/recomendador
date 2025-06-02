import React from 'react';
import { MoviePreferencesForm } from '../components/MoviePreferencesForm';
import { RecommendationCard } from '../components/RecommendationCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { useRecommendations } from '../hooks/useRecommendations';
import { addSearchHistory } from '../hooks/useSearchHistory';

export const MovieSearch: React.FC = () => {
  const { movies, loading, getRecommendations } = useRecommendations();
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);

  const onSubmit = async (genres: { id: string; name: string }[]) => {
    setSelectedGenres(genres.map(g => g.name));
    await getRecommendations(genres.map(g => g.id), []);
    if (genres.length > 0) {
      await addSearchHistory({
        type: 'movie',
        query: genres.map(g => g.name).join(', '),
        filters: { genres: genres.map(g => g.name) },
        timestamp: Date.now(),
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <MoviePreferencesForm onSubmit={onSubmit} />
      <div className="mt-8">
        {loading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedGenres.length === 0 && (
              <p className="col-span-full text-center text-accent-light">
                No has seleccionado ningún género de película.
              </p>
            )}
            {selectedGenres.length > 0 && movies.length === 0 && (
              <p className="col-span-full text-center text-accent-light">
                No se encontraron películas para los géneros seleccionados.
              </p>
            )}
            {movies.map(m => (
              <RecommendationCard
                key={m.id}
                title={m.title}
                imageUrl={m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : undefined}
                description={m.overview}
                link={`https://www.themoviedb.org/movie/${m.id}`}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
};
