import React from 'react';
import { MoviePreferencesForm } from '../components/MoviePreferencesForm';
import { RecommendationCard } from '../components/RecommendationCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { SearchPagination } from '../components/SearchPagination';
import { useRecommendations } from '../hooks/useRecommendations';
import { addSearchHistory } from '../hooks/useSearchHistory';

export const MovieSearch: React.FC = () => {
  const { movies, loading, moviePagination, getMovieRecommendationsPaginated } = useRecommendations();
  const [searchCriteria, setSearchCriteria] = React.useState<string>('');
  const [currentSearchParams, setCurrentSearchParams] = React.useState<any>(null);
  const onSubmit = async (params: {
    genres: { id: string; name: string }[];
    title: string;
    actor: string;
  }) => {
    const { genres, title, actor } = params;
    
    // Crear descripción de los criterios de búsqueda
    const criteria: string[] = [];
    if (genres.length > 0) {
      criteria.push(`Géneros: ${genres.map(g => g.name).join(', ')}`);
    }
    if (title.trim()) {
      criteria.push(`Título: ${title}`);
    }
    if (actor.trim()) {
      criteria.push(`Actor: ${actor}`);
    }
    
    setSearchCriteria(criteria.join(' | '));
    
    // Guardar parámetros para paginación
    const searchParams = {
      genres: genres.map(g => g.id),
      title: title.trim() || undefined,
      actor: actor.trim() || undefined,
      page: 1
    };
    setCurrentSearchParams(searchParams);
    
    await getMovieRecommendationsPaginated(searchParams);
    
    if (criteria.length > 0) {
      await addSearchHistory({
        type: 'movie',
        query: criteria.join(' | '),
        filters: { 
          genres: genres.map(g => g.name),
          title: title.trim() || undefined,
          actor: actor.trim() || undefined,
        },
        timestamp: Date.now(),
      });
    }
  };

  const handlePageChange = async (page: number) => {
    if (currentSearchParams) {
      const newParams = { ...currentSearchParams, page };
      await getMovieRecommendationsPaginated(newParams);
    }
  };
  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8">
      <MoviePreferencesForm onSubmit={onSubmit} />
      <div className="mt-6 sm:mt-8">
        {loading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </section>        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {!searchCriteria && (
                <p className="col-span-full text-center text-accent-light text-sm sm:text-base">
                  Especifica al menos un criterio de búsqueda (género, título o actor).
                </p>
              )}
              {searchCriteria && movies.length === 0 && (
                <p className="col-span-full text-center text-accent-light text-sm sm:text-base">
                  No se encontraron películas para los criterios especificados: {searchCriteria}
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
            
            {/* Pagination Component */}
            {searchCriteria && movies.length > 0 && (
              <SearchPagination
                currentPage={moviePagination.currentPage}
                totalPages={moviePagination.totalPages}
                totalResults={moviePagination.totalResults}
                itemsPerPage={20}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
