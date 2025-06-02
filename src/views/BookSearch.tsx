import React from 'react';
import { BookPreferencesForm } from '../components/BookPreferencesForm';
import { RecommendationCard } from '../components/RecommendationCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { useRecommendations } from '../hooks/useRecommendations';
import { addSearchHistory } from '../hooks/useSearchHistory';

export const BookSearch: React.FC = () => {
  const { books, loading, getRecommendations } = useRecommendations();
  const [selectedAuthors, setSelectedAuthors] = React.useState<string[]>([]);

  const onSubmit = async (authors: { name: string }[]) => {
    setSelectedAuthors(authors.map(a => a.name));
    await getRecommendations([], authors.map(a => a.name));
    if (authors.length > 0) {
      await addSearchHistory({
        type: 'book',
        query: authors.map(a => a.name).join(', '),
        filters: { authors: authors.map(a => a.name) },
        timestamp: Date.now(),
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <BookPreferencesForm onSubmit={onSubmit} />
      <div className="mt-8">
        {loading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedAuthors.length === 0 && (
              <p className="col-span-full text-center text-accent-light">
                No has seleccionado ningún autor.
              </p>
            )}
            {selectedAuthors.length > 0 && books.length === 0 && (
              <p className="col-span-full text-center text-accent-light">
                No se encontraron libros para los autores seleccionados.
              </p>
            )}
            {books.map(b => (
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
    </div>
  );
};
