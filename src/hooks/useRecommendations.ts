import { useState } from 'react';
import { fetchMoviesByGenres } from '../api/tmdb';
import { fetchBooksByAuthors } from '../api/books';
import type { Movie } from '../types/movie';
import type { Book } from '../types/book';

export function useRecommendations() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  async function getRecommendations(genres: string[], authors: string[]) {
    setLoading(true);
    try {
      const [m, b] = await Promise.all([
        fetchMoviesByGenres(genres),
        fetchBooksByAuthors(authors),
      ]);
      setMovies(m);
      setBooks(b);
    } finally {
      setLoading(false);
    }
  }

  return { movies, books, loading, getRecommendations };
}