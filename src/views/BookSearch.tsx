import React from 'react';
import { BookPreferencesForm } from '../components/BookPreferencesForm';
import { RecommendationCard } from '../components/RecommendationCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { SearchPagination } from '../components/SearchPagination';
import { useRecommendations } from '../hooks/useRecommendations';
import { addSearchHistory } from '../hooks/useSearchHistory';

export const BookSearch: React.FC = () => {
  const { books, loading, bookPagination, getBookRecommendationsPaginated } = useRecommendations();
  const [searchCriteria, setSearchCriteria] = React.useState<string>('');
  const [currentSearchParams, setCurrentSearchParams] = React.useState<any>(null);
  const onSubmit = async (params: {
    authors: { name: string }[];
    title: string;
    genre: string;
  }) => {
    const { authors, title, genre } = params;
    
    // Crear descripción de los criterios de búsqueda
    const criteria: string[] = [];
    if (authors.length > 0) {
      criteria.push(`Autores: ${authors.map(a => a.name).join(', ')}`);
    }
    if (title.trim()) {
      criteria.push(`Título: ${title}`);
    }
    if (genre.trim()) {
      criteria.push(`Género: ${genre}`);
    }
    
    setSearchCriteria(criteria.join(' | '));
    
    // Guardar parámetros para paginación
    const searchParams = {
      authors: authors.map(a => a.name),
      title: title.trim() || undefined,
      genre: genre.trim() || undefined,
      page: 1
    };
    setCurrentSearchParams(searchParams);
      await getBookRecommendationsPaginated(searchParams);
    
    if (criteria.length > 0) {
      console.log('📚🔥 ATTEMPTING TO SAVE SEARCH HISTORY');
      console.log('📚🔥 Search criteria:', criteria.join(' | '));
      console.log('📚🔥 Authors:', authors.map(a => a.name));
      console.log('📚🔥 Title:', title.trim() || undefined);
      console.log('📚🔥 Genre:', genre.trim() || undefined);
      
      try {        // Crear filtros sin valores undefined (Firebase no los acepta)
        const filters: any = {
          authors: authors.map(a => a.name),
        };
        
        // Solo agregar campos si tienen valor
        if (title.trim()) {
          filters.title = title.trim();
        }
        if (genre.trim()) {
          filters.genre = genre.trim();
        }
        
        const historyItem = {
          type: 'book' as const,
          query: criteria.join(' | '),
          filters,
          timestamp: Date.now(),
        };
        
        console.log('📚🔥 History item to save:', historyItem);
        await addSearchHistory(historyItem);
        console.log('📚✅ SEARCH HISTORY SAVED SUCCESSFULLY');
      } catch (error) {
        console.error('📚❌ ERROR SAVING SEARCH HISTORY:', error);
        console.error('📚❌ Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      }
    }
  };
  const handlePageChange = async (page: number) => {
    if (currentSearchParams) {
      const newParams = { ...currentSearchParams, page };
      setCurrentSearchParams(newParams); // Actualizar el estado con la nueva página
      await getBookRecommendationsPaginated(newParams);
    }
  };
  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8">
      <BookPreferencesForm onSubmit={onSubmit} />
      <div className="mt-6 sm:mt-8">
        {loading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </section>        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {searchCriteria === '' && (
                <p className="col-span-full text-center text-accent-light text-sm sm:text-base">
                  Usa el formulario para buscar libros por autor, título o género.
                </p>
              )}
              {searchCriteria !== '' && books.length === 0 && (
                <p className="col-span-full text-center text-accent-light text-sm sm:text-base">
                  No se encontraron libros para los criterios: {searchCriteria}
                </p>
              )}
              {books.map(b => (
                <RecommendationCard
                  key={b.id}
                  title={b.title}
                  imageUrl={b.imageLinks?.thumbnail}
                  description={b.description}
                  link={b.previewLink || `https://books.google.com/books?id=${b.id}`}
                />
              ))}
            </section>
            
            {/* Pagination Component */}
            {searchCriteria !== '' && books.length > 0 && (
              <SearchPagination
                currentPage={bookPagination.currentPage}
                totalPages={bookPagination.totalPages}
                totalResults={bookPagination.totalResults}
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
